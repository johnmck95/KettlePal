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

export function createTokens(user: User): {
  refreshToken: string;
  accessToken: string;
} {
  if (
    process.env.REFRESH_TOKEN_SECRET === undefined ||
    process.env.ACCESS_TOKEN_SECRET === undefined
  ) {
    return { refreshToken: "", accessToken: "" };
  }
  const refreshToken = sign(
    { userUid: user.uid, tokenCount: user.tokenCount },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30 days",
    }
  );
  const accessToken = sign(
    { userUid: user.uid },
    process.env.ACCESS_TOKEN_SECRET,
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
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    path: "/",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });
}

export function setRefreshToken(res: Response, refreshToken: string) {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
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

    // Grab the user referenced in the JWT
    const user = await knexInstance("users")
      .where({ uid: data.userUid })
      .first();

    // Create new tokens
    const tokens = createTokens(user);
    if (!tokens) {
      return { success: false, message: "Failed to create tokens" };
    }
    const { refreshToken: newRefreshToken, accessToken: newAccessToken } =
      tokens;

    // Set new tokens in HTTP-only cookies
    setAccessToken(res, newAccessToken);
    setRefreshToken(res, newRefreshToken);

    return { success: true, message: "Tokens refreshed successfully" };
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    return { success: false, message: "Invalid refresh token" };
  }
}
