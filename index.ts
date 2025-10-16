import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import sequelize from "./config/database";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/user";
import boardRoutes from "./routes/board";
import listRoutes from "./routes/list";
import cardRoutes from "./routes/card";

const app = express();

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);

import { User } from "./models/user";
import Board from "./models/board";
import List from "./models/list";
import Card from "./models/card";

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(authRoutes);
app.use(boardRoutes);
app.use(listRoutes);
app.use(cardRoutes);

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({
    isSuccess: false,
    message: err.message || "Internal Server Error",
  });
});

User.hasMany(Board, {
  foreignKey: "userId",
  onDelete: "CASCADE",
  as: "boards",
});
Board.belongsTo(User, { foreignKey: "userId", as: "user" });

Board.hasMany(List, {
  foreignKey: "boardId",
  onDelete: "CASCADE",
  as: "lists",
});
List.belongsTo(Board, { foreignKey: "boardId", as: "board" });

List.hasMany(Card, { foreignKey: "listId", onDelete: "CASCADE", as: "cards" });
Card.belongsTo(List, { foreignKey: "listId", as: "list" });

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established successfully.");
  })
  .then(() => sequelize.sync())
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server running on port ${process.env.PORT || 4000}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default app;
