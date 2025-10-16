import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { User } from "../models/user";
import asyncHandler from "../utils/asyncHandler";
import redis from "../config/redis";
import { generateAccessToken, generateRefreshToken } from "../utils/token";
import { AuthRequest } from "../middlewares/authMiddleware";

// Register
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409);
      throw new Error("User already exists.");
    }

    // const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      isSuccess: true,
      message: "User registered successfully",
      user: { id: newUser.id, name: newUser.name, email: newUser.email },
    });
  }
);

// Login
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  console.log("Login route hit", req.body);
  // Explicitly select password because some ORMs hide it by default
  const user = await User.findOne({
    where: { email },
    attributes: ["id", "name", "email", "password"],
  });

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  // Generate tokens
  const accessToken = generateAccessToken({ id: user.id, email: user.email });
  const refreshToken = generateRefreshToken({ id: user.id, email: user.email });

  // Store refresh token in Redis
  await redis.set(
    `refreshToken:${refreshToken}`,
    user.id.toString(),
    "EX",
    7 * 24 * 60 * 60 // 7 days
  );

  // Set cookies
  res.cookie("token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 60 * 1000, // 1 min for testing
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.status(200).json({
    isSuccess: true,
    message: "Login successful",
    user: { id: user.id, name: user.name, email: user.email },
  });
});

// Logout
export const logout = asyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (refreshToken) await redis.del(`refreshToken:${refreshToken}`);

  res.clearCookie("token");
  res.clearCookie("refreshToken");

  res.status(200).json({ message: "Logout successful" });
});

// Get Current User
export const getCurrentUser = asyncHandler(async (req: AuthRequest, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  res.status(200).json({
    isSuccess: true,
    user: req.user,
  });
});

export const refreshToken = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
      res.status(401);
      throw new Error("Refresh token missing");
    }

    try {
      // Verify JWT signature
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as any;

      // Check Redis
      const userId = await redis.get(`refreshToken:${refreshToken}`);
      if (!userId || parseInt(userId) !== decoded.userId) {
        res.status(403);
        throw new Error("Invalid refresh token");
      }

      const newAccessToken = generateAccessToken({
        id: decoded.userId,
        email: decoded.email,
      });

      res.cookie("token", newAccessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: 60 * 1000, // 1 min
      });

      res.status(200).json({ message: "Access token refreshed" });
    } catch (err) {
      res.status(403);
      throw new Error("Invalid refresh token");
    }
  }
);
