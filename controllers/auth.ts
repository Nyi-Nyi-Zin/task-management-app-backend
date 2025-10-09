import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import asyncHandler from "../utils/asyncHandler";
import { AuthRequest } from "../middlewares/authMiddleware";

// Extend Request interface for auth middleware
// interface AuthRequest extends Request {
//   userId?: number;
// }

//Refactored
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409);
      throw new Error("User already exist with this email address.");
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

export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: { email },
    attributes: ["id", "name", "email", "password"],
  });

  if (!user) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const isMatch = await user.matchPassword(password);
  console.log("Password match:", isMatch);
  if (!isMatch) {
    res.status(401);
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "1h" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    maxAge: 60 * 60 * 1000,
  });

  res.status(200).json({
    isSuccess: true,
    message: "Login successful",
    user: { id: user.id, name: user.name, email: user.email },
    token,
  });
});

// GET all users
export const getAllUsers = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const users = await User.findAll({
      attributes: ["id", "email"],
    });

    res.status(200).json({
      isSuccess: true,
      message: "All users fetched successfully",
      users,
    });
  }
);

export const getUserInfo = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { user } = req;
    if (!user) {
      res.status(401);
      throw new Error("Not authorized.");
    }

    const userDoc = await User.findByPk(user.id, {
      attributes: ["id", "name", "email"],
    });

    if (!userDoc) {
      res.status(404);
      throw new Error("User not found.");
    }

    res.status(200).json({
      isSuccess: true,
      user: { id: userDoc.id, name: userDoc.name, email: userDoc.email },
    });
  }
);

// CHECK current user
// export const checkCurrentUser = asyncHandler(
//   async (req: AuthRequest, res: Response): Promise<void> => {
//     if (!req.userId) {
//       res.status(401).json({
//         isSuccess: false,
//         message: "Unauthorized",
//       });
//       return;
//     }

//     const user = await User.findByPk(req.userId, {
//       attributes: ["id", "email"],
//     });

//     if (!user) {
//       res.status(401).json({
//         isSuccess: false,
//         message: "User not found",
//       });
//       return;
//     }

//     res.status(200).json({
//       isSuccess: true,
//       message: "User is authorized",
//       user,
//     });
//   }
// );

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });

  res.status(200).json({ message: "Logout successful" });
});
