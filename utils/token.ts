import jwt from "jsonwebtoken";

export const generateAccessToken = (user: { id: number; email: string }) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET || "secret",
    {
      expiresIn: "1m",
    }
  );
};

export const generateRefreshToken = (user: { id: number; email: string }) => {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_REFRESH_SECRET || "refreshSecret",
    {
      expiresIn: "7d",
    }
  );
};
