import { Request, Response, NextFunction } from "express";
import asyncHandler from "../utils/asyncHandler";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user";

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
    let token;

    token = req.cookies.token;

    if (!token) {
      res.status(401);
      throw new Error("Not authorized.");
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;

      if (!decoded) {
        res.status(401);
        throw new Error("Not authorized. Invalid token.");
      }

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
    } catch (error) {
      res.status(401);
      throw new Error("Not authorized. Invalid token.");
    }
  }
);
