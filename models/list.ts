// models/list.ts
import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const List = sequelize.define(
  "List",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    boardId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    tableName: "lists",
    timestamps: true,
    underscored: true,
  }
);

export default List;
