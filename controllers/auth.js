const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

//create new user
exports.createUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      isSuccess: false,
      message: errors.array()[0].msg,
    });
  }
  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({ where: { email } });

    if (userDoc) {
      return res.status(409).json({
        message: "User already exists",
        isSuccess: false,
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({
      email,
      password: hashedPassword,
    });

    return res.status(201).json({
      message: "User created successfully",
      isSuccess: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error creating user",
      error: error,
    });
  }
};

//login user
exports.loginUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      isSuccess: false,
      message: errors.array()[0].msg,
    });
  }

  const { email, password } = req.body;

  try {
    const userDoc = await User.findOne({ where: { email } });

    if (!userDoc) {
      return res.status(401).json({
        message: "Invalid credentials",
        isSuccess: false,
      });
    }

    //check password
    const isMatch = await bcrypt.compare(password, userDoc.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
        isSuccess: false,
      });
    }

    //generate token
    const token = jwt.sign(
      { userId: userDoc.id, email: userDoc.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.status(200).json({
      message: "Login successful",
      isSuccess: true,
      token,
      user: userDoc,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error logging in",
      error: error,
    });
  }
};

exports.checkCurrentUser = async (req, res) => {
  try {
    const userDoc = await User.findByPk(req.userId, {
      attributes: ["id", "email"],
    });

    if (!userDoc) {
      return res.status(401).json({
        isSuccess: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      isSuccess: true,
      message: "User is authorized",
      userDoc,
    });
  } catch (error) {
    return res.status(401).json({
      isSuccess: false,
      message: error.message,
    });
  }
};
