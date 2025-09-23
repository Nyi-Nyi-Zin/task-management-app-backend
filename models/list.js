const Sequelize = require("sequelize");

const sequelize = require("../utils/database");

const List = sequelize.define("list", {
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
  boardId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
});

module.exports = List;
