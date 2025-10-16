import { Router } from "express";
import { body } from "express-validator";
import { protect } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logout,
  refreshToken,
} from "../controllers/auth";

const router = Router();

// Register
router.post(
  "/auth/register",
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
  registerUser
);

// Login
router.post(
  "/auth/login",
  [
    body("password").trim().notEmpty().withMessage("Password can't be empty."),
    body("email").trim().isEmail().withMessage("Please enter a valid E-mail!"),
  ],
  loginUser
);

router.post("/auth/refresh", refreshToken);

// Get current user
router.get("/me", protect, getCurrentUser);

// Logout
router.post("/logout", logout);

export default router;
