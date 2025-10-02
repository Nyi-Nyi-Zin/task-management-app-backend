const sequelize = require("../utils/database");
const Board = require("./board");
const List = require("./list");
const Card = require("./card");
const User = require("./user");

// Associations
User.hasMany(Board, {
  foreignKey: "userId",
  as: "boards",
  onDelete: "CASCADE",
});
Board.belongsTo(User, { foreignKey: "userId", as: "user" });

Board.hasMany(List, {
  foreignKey: "boardId",
  as: "lists",
  onDelete: "CASCADE",
});
List.belongsTo(Board, { foreignKey: "boardId", as: "board" });

List.hasMany(Card, { foreignKey: "listId", as: "cards", onDelete: "CASCADE" });
Card.belongsTo(List, { foreignKey: "listId", as: "list" });

module.exports = { sequelize, Board, List, Card, User };
