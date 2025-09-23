const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const Card = sequelize.define("card", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  title: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  description: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  listId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = Card;
