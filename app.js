require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");

// Database connection
const Board = require("./models/board");
const List = require("./models/list");
const Card = require("./models/card");
const User = require("./models/user");

const sequelize = require("./utils/database");

// routes imports
const authRoutes = require("./routes/auth");
const boardRoutes = require("./routes/board");
const listRoutes = require("./routes/list");
const cardRoutes = require("./routes/card");

app.use(
  cors({
    origin: "*",
  })
);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../client/public")));

// Routes
app.use(authRoutes);
app.use(boardRoutes);
app.use(listRoutes);
app.use(cardRoutes);

// Associations
User.hasMany(Board, { foreignKey: "userId", onDelete: "CASCADE" });
Board.belongsTo(User, { foreignKey: "userId" });

Board.hasMany(List, { foreignKey: "boardId", onDelete: "CASCADE" });
List.belongsTo(Board, { foreignKey: "boardId" });

List.hasMany(Card, { foreignKey: "listId", onDelete: "CASCADE" });
Card.belongsTo(List, { foreignKey: "listId" });

sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established successfully.");

    return sequelize.sync();
  })
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server running on port ${process.env.PORT || 4000}`);
    });
  })
  .catch((err) => {
    console.error(" Unable to connect to the database:", err);
  });
