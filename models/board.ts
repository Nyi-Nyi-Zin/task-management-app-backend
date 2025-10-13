import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import { ListAttributes, ListInstance } from "./list";

export interface BoardAttributes {
  id?: number;
  title: string;
  userId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface BoardInstance extends Model<BoardAttributes>, BoardAttributes {
  lists?: ListInstance[];
}

const Board = sequelize.define<BoardInstance>(
  "Board",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "boards", timestamps: true, underscored: true }
);

export default Board;
