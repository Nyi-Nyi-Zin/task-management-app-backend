import { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import authMiddleware from "../middlewares/auth";
import {
  checkCurrentUser,
  createUser,
  getAllUsers,
  loginUser,
} from "../controllers/auth";

const router = Router();

// Create new user
router.post(
  "/register",
  [
    body("email").trim().notEmpty().withMessage("Email cannot be empty."),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password cannot be empty.")
      .isLength({ min: 5 })
      .withMessage("Password must have at least 5 characters."),
    body("email").trim().isEmail().withMessage("Please enter a valid E-mail!"),
  ],
  createUser
);

// Login user
router.post(
  "/login",
  [
    body("password").trim().notEmpty().withMessage("Password can't be empty."),
    body("email").trim().isEmail().withMessage("Please enter a valid E-mail!"),
  ],
  loginUser
);

// Check if user is logged in
router.get("/get-current-user", authMiddleware, checkCurrentUser);

// Get all users
router.get("/users", getAllUsers);

export default router;
