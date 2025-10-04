import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AuthRequest extends Request {
  userId?: number;
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    if (
      process.env.NODE_ENV === "development" &&
      !req.header("Authorization")
    ) {
      req.userId = 1;
      return next();
    }

    const token = req.header("Authorization")?.split(" ")[1];
    if (!token)
      return res
        .status(401)
        .json({ isSuccess: false, message: "Token missing" });

    const decryptedTokenDetails: any = jwt.verify(
      token,
      process.env.JWT_SECRET || ""
    );
    req.userId = decryptedTokenDetails.userId;
    next();
  } catch (err: any) {
    let errorMessage = "Unauthorized";
    if (err.name === "TokenExpiredError") errorMessage = "Token expired";
    else if (err.name === "JsonWebTokenError") errorMessage = "Invalid token";

    return res.status(401).json({ isSuccess: false, message: errorMessage });
  }
};

export default authMiddleware;
