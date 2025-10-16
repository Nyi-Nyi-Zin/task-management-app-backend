// models/list.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";
import { CardAttributes, CardInstance } from "./card";

export interface ListAttributes {
  id?: number;
  title: string;
  boardId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ListInstance extends Model<ListAttributes>, ListAttributes {
  cards?: CardInstance[];
}

const List = sequelize.define<ListInstance>(
  "List",
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
    boardId: { type: DataTypes.INTEGER, allowNull: false },
  },
  { tableName: "lists", timestamps: true, underscored: true }
);

export default List;
