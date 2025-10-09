import { Router, Request, Response, NextFunction } from "express";
import { body } from "express-validator";
import { protect } from "../middlewares/authMiddleware";
import { validateRequest } from "../middlewares/validateRequest";
import {
  // checkCurrentUser,
  registerUser,
  getAllUsers,
  loginUser,
  getUserInfo,
} from "../controllers/auth";

const router = Router();

// Create new user
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

// Login user
router.post(
  "/auth/login",
  [
    body("password").trim().notEmpty().withMessage("Password can't be empty."),
    body("email").trim().isEmail().withMessage("Please enter a valid E-mail!"),
  ],
  loginUser
);

router.get("/me", protect, getUserInfo);

// router.get("/get-current-user", protect, checkCurrentUser);

router.get("/users", protect, getAllUsers);

// router.post("/logout", logout);

export default router;
