import jwt from "jsonwebtoken";
import { env } from "@/config";

export const signAccessToken = (payload: {
  userId: string;
  role: string;
  branchId?: string;
}) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });
};

export const signRefreshToken = (payload: { userId: string }) => {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, {
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as {
    userId: string;
    role: string;
    branchId?: string;
  };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as { userId: string };
};
