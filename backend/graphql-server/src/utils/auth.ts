import jwt from "jsonwebtoken";
import knex from "knex";
import { User } from "../generated/backend-types.js";
import { Request, Response } from "express";
import knexConfig from "../knexfile.js";
const { sign, verify } = jwt;

export interface TokenPayload {
  userUid: string;
  tokenCount: number;
  iat?: number;
  exp?: number;
}

export interface AuthenticatedRequest extends Request {
  userUid?: string;
}

class MissingTokenSecretError extends Error {
  constructor(missing: string[]) {
    super(
      `Missing JWT secret(s) in environment: ${missing.join(
        ", "
      )}. Refusing to issue tokens.`
    );
    this.name = "MissingTokenSecretError";
  }
}

export function createTokens(user: User): {
  refreshToken: string;
  accessToken: string;
} {
  const missing: string[] = [];
  if (process.env.REFRESH_TOKEN_SECRET === undefined) {
    missing.push("REFRESH_TOKEN_SECRET");
  }
  if (process.env.ACCESS_TOKEN_SECRET === undefined) {
    missing.push("ACCESS_TOKEN_SECRET");
  }
  if (missing.length > 0) {
    // Throwing here (instead of returning empty strings) fails fast at the
    // call site — signUp / login / refreshTokens all wrap their calls in
    // try/catch and will surface the error to the client. Returning empty
    // tokens silently would set useless cookies the client would then try
    // to use, masking the misconfiguration.
    throw new MissingTokenSecretError(missing);
  }
  // The non-null assertions are safe because the throw above guards both
  // env vars. process.env.* is typed as `string | undefined` regardless of
  // runtime checks, so TS needs the hint.
  const refreshToken = sign(
    { userUid: user.uid, tokenCount: user.tokenCount },
    process.env.REFRESH_TOKEN_SECRET!,
    {
      expiresIn: "30 days",
    }
  );
  const accessToken = sign(
    { userUid: user.uid },
    process.env.ACCESS_TOKEN_SECRET!,
    {
      expiresIn: "15m",
    }
  );

  return { refreshToken, accessToken };
}

export const REFRESH_TOKEN_COOKIE_NAME = "refresh-token";
export const ACCESS_TOKEN_COOKIE_NAME = "access-token";

export function setAccessToken(res: Response, accessToken: string) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    // `secure` must be true for any `sameSite` value other than "none" — we
    // keep it gated on production so dev over plain HTTP still works.
    secure: process.env.NODE_ENV === "production",
    // Lax blocks cross-site sub-requests (the CSRF vector) while still
    // allowing top-level navigations, which is what we want. Combined with
    // the Origin guard in src/index.ts, cross-site POSTs from any other
    // origin can't carry these cookies even if Lax were ever bypassed.
    sameSite: "lax",
    path: "/",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
}

export function setRefreshToken(res: Response, refreshToken: string) {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}

export async function refreshTokens(req: AuthenticatedRequest, res: Response) {
  const knexInstance = knex(knexConfig);
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

  if (!refreshToken) {
    return { success: false, message: "Refresh token not found" };
  }

  if (process.env.REFRESH_TOKEN_SECRET === undefined) {
    return;
  }

  try {
    // Verify the JWT refresh token with our secret
    const data = verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET
    ) as TokenPayload;

    // Atomically rotate tokenCount. The JWT's stamped tokenCount must match
    // the DB's current value — if it doesn't, another refresh (or an
    // invalidateToken) has already moved on and this token is stale. Doing
    // the check and the increment in a single conditional UPDATE prevents
    // the race where two concurrent refreshes both read the same tokenCount
    // and both mint valid new tokens.
    const incremented = await knexInstance("users")
      .where({ uid: data.userUid, tokenCount: data.tokenCount })
      .increment("tokenCount", 1);

    if (incremented === 0) {
      // The token was validly signed but its tokenCount no longer matches
      // the DB — either a parallel refresh won, or the user logged out
      // everywhere. Clear cookies so the client re-authenticates.
      res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
      res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
      return { success: false, message: "Stale refresh token" };
    }

    // Re-read the user to get the *new* tokenCount for the freshly-issued
    // tokens. We sign with the new value so the next refresh also passes
    // the conditional update.
    const user = await knexInstance("users")
      .where({ uid: data.userUid })
      .first();

    // Create new tokens. Throws if the JWT secrets are missing — that gets
    // caught below and surfaces as a refresh failure.
    const { refreshToken: newRefreshToken, accessToken: newAccessToken } =
      createTokens(user);

    // Set new tokens in HTTP-only cookies
    setAccessToken(res, newAccessToken);
    setRefreshToken(res, newRefreshToken);

    return { success: true, message: "Tokens refreshed successfully" };
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error refreshing token:", error.message);
    } else {
      console.error("Error refreshing token:", error);
    }
    // Clear cookies on any refresh failure so the client re-authenticates
    // rather than retrying against the same broken tokens.
    res.clearCookie(ACCESS_TOKEN_COOKIE_NAME);
    res.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Invalid refresh token",
    };
  }
}
