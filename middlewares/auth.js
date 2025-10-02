const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    // ===== Dev shortcut =====
    if (
      process.env.NODE_ENV === "development" &&
      !req.header("Authorization")
    ) {
      req.userId = 1; // fake user id for testing
      return next();
    }
    // =======================

    const token = req.header("Authorization").split(" ")[1];
    if (!token) {
      return res.status(401).json({
        isSuccess: false,
        message: "Token missing",
      });
    }

    const decryptedTokenDetails = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decryptedTokenDetails.userId;
    next();
  } catch (err) {
    let errorMessage = "Unauthorized";

    if (err.name === "TokenExpiredError") {
      errorMessage = "Token expired";
    } else if (err.name === "JsonWebTokenError") {
      errorMessage = "Invalid token";
    }

    return res.status(401).json({
      isSuccess: false,
      message: errorMessage,
    });
  }
};
