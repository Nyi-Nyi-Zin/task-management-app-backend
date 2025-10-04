import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/user";

// Extend Request interface for auth middleware
interface AuthRequest extends Request {
  userId?: number;
}

// GET all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "email"], // exclude sensitive info
    });

    res.status(200).json({
      isSuccess: true,
      message: "All users fetched successfully",
      users,
    });
  } catch (error: any) {
    res.status(500).json({ isSuccess: false, message: error.message });
  }
};

// CREATE new user
export const createUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      isSuccess: false,
      message: errors.array()[0].msg,
    });
  }

  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ isSuccess: false, message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({ email, password: hashedPassword });

    res.status(201).json({
      isSuccess: true,
      message: "User created successfully",
      user: { id: newUser.id, email: newUser.email },
    });
  } catch (error: any) {
    res.status(500).json({ isSuccess: false, message: error.message });
  }
};

// LOGIN user
export const loginUser = async (req: Request, res: Response) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(400)
      .json({ isSuccess: false, message: errors.array()[0].msg });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res
        .status(401)
        .json({ isSuccess: false, message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ isSuccess: false, message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({
      isSuccess: true,
      message: "Login successful",
      token,
      user: { id: user.id, email: user.email },
    });
  } catch (error: any) {
    res.status(500).json({ isSuccess: false, message: error.message });
  }
};

// CHECK current user
export const checkCurrentUser = async (req: AuthRequest, res: Response) => {
  if (!req.userId)
    return res.status(401).json({ isSuccess: false, message: "Unauthorized" });

  try {
    const user = await User.findByPk(req.userId, {
      attributes: ["id", "email"],
    });

    if (!user)
      return res
        .status(401)
        .json({ isSuccess: false, message: "User not found" });

    res
      .status(200)
      .json({ isSuccess: true, message: "User is authorized", user });
  } catch (error: any) {
    res.status(500).json({ isSuccess: false, message: error.message });
  }
};
