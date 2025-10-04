import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Board = sequelize.define(
  "Board",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "boards", timestamps: true, underscored: true }
);

export default Board;
