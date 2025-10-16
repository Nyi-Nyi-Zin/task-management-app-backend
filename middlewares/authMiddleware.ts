import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user";
import redis from "../config/redis";
import { generateAccessToken } from "../utils/token";

interface IUserPayload {
  id: number;
  name: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: IUserPayload;
}

export const protect = asyncHandler(
  async (req: AuthRequest, res: Response, next: NextFunction) => {
    let token = req.cookies.token;

    const attachUserAndNext = async (decoded: JwtPayload) => {
      const user = await User.findByPk(decoded.userId, {
        attributes: { exclude: ["password"] },
      });
      if (!user) {
        res.status(401);
        throw new Error("User not found.");
      }

      req.user = {
        id: user.id,
        name: user.name,
        email: user.email,
      } as IUserPayload;
      next();
    };

    // Try access token
    if (token) {
      try {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET!
        ) as JwtPayload;
        return await attachUserAndNext(decoded);
      } catch {}
    }

    // If access token missing/expired, try refresh token
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    try {
      const decodedRefresh = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as JwtPayload;
      const userIdInRedis = await redis.get(`refreshToken:${refreshToken}`);
      if (!userIdInRedis || parseInt(userIdInRedis) !== decodedRefresh.userId) {
        res.status(403);
        throw new Error("Invalid refresh token");
      }

      // Generate new access token
      const newAccessToken = generateAccessToken({
        id: decodedRefresh.userId,
        email: decodedRefresh.email,
      });
      res.cookie("token", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 1000,
      });

      const decodedNew = jwt.verify(
        newAccessToken,
        process.env.JWT_SECRET!
      ) as JwtPayload;
      await attachUserAndNext(decodedNew);
    } catch (err) {
      res.status(403);
      throw new Error("Invalid refresh token");
    }
  }
);
