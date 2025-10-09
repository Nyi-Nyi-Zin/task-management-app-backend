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

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(authRoutes);
app.use(boardRoutes);
app.use(listRoutes);
app.use(cardRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established successfully.");
    return sequelize.sync();
  })
  // .then(() => sequelize.sync({ force: true }))
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server running on port ${process.env.PORT || 4000}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

export default app;
