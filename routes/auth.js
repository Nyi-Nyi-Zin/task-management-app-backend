const { Router } = require("express");
const authMiddleware = require("../middlewares/auth");
const { body } = require("express-validator");

const router = Router();

const authController = require("../controllers/auth");

//create new user
router.post(
  "/register",
  [
    body("email").trim().notEmpty().withMessage("Email Cannot be empty."),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password Cannot be empty.")
      .isLength({ min: 5 })
      .withMessage("Password must have at least 5 characters."),
    body("email").trim().isEmail().withMessage("Please enter a vaild E-mail !"),
  ],
  authController.createUser
);

//login user
router.post(
  "/login",
  [
    body("password").trim().notEmpty().withMessage("Password can't be empty."),
    body("email").trim().isEmail().withMessage("Please enter a vaild E-mail !"),
  ],
  authController.loginUser
);

//check user is login or not
router.get(
  "/get-current-user",
  authMiddleware,
  authController.checkCurrentUser
);

module.exports = router;
