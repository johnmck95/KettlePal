import pkg from "jsonwebtoken";
import knexConfig from "../../knexfile.js";
import knex from "knex";
import { User } from "../generated/backend-types.js";

const { sign, verify } = pkg;

export function createTokens(user: User) {
  const refreshToken = sign(
    { userUid: user.uid, tokenCount: user.tokenCount },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: "30days",
    }
  );
  const accessToken = sign(
    { userUid: user.uid },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "15mins",
    }
  );

  return { refreshToken, accessToken };
}

export const REFRESH_TOKEN_COOKIE_NAME = "refresh-token";
export const ACCESS_TOKEN_COOKIE_NAME = "access-token";

export function setAccessToken(res: any, accessToken: string) {
  res.cookie(ACCESS_TOKEN_COOKIE_NAME, accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    path: "/",
    // maxAge: 15 * 60 * 1000, // 15 minutes
    maxAge: 2 * 24 * 60 * 60 * 1000, // 2 days
  });
}

export function setRefreshToken(res: any, refreshToken: string) {
  res.cookie(REFRESH_TOKEN_COOKIE_NAME, refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    path: "/",
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
}

export async function refreshTokens(req, res) {
  const knexInstance = knex(knexConfig);
  const refreshToken = req.cookies[REFRESH_TOKEN_COOKIE_NAME];

  if (!refreshToken) {
    return { success: false, message: "Refresh token not found" };
  }

  try {
    // Verify the JWT refresh token with our secret
    const data = verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    // Grab the user referenced in the JWT
    const user = await knexInstance("users")
      .where({ uid: data.userUid })
      .first();

    // Create new tokens
    const { refreshToken: newRefreshToken, accessToken: newAccessToken } =
      createTokens(user);

    // Set new tokens in HTTP-only cookies
    setAccessToken(res, newAccessToken);
    setRefreshToken(res, newRefreshToken);

    return { success: true, message: "Tokens refreshed successfully" };
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    return { success: false, message: "Invalid refresh token" };
  }
}
