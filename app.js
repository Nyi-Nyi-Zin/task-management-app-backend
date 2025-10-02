require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// Import sequelize and models from models/index.js
const { sequelize } = require("./models");

// Routes imports
const authRoutes = require("./routes/auth");
const boardRoutes = require("./routes/board");
const listRoutes = require("./routes/list");
const cardRoutes = require("./routes/card");

// Middleware
app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "../client/public")));

// Routes
app.use(authRoutes);
app.use(boardRoutes);
app.use(listRoutes);
app.use(cardRoutes);

// Start server after DB connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Database connection established successfully.");

    // sync database
    return sequelize.sync(); // or { alter: true } if you want auto updates
  })
  .then(() => {
    app.listen(process.env.PORT || 4000, () => {
      console.log(`Server running on port ${process.env.PORT || 4000}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = app;
