// models/card.ts
import { DataTypes, Model } from "sequelize";
import sequelize from "../config/database";

export interface CardAttributes {
  id?: number;
  title: string;
  description?: string;
  listId: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CardInstance extends Model<CardAttributes>, CardAttributes {}

const Card = sequelize.define<CardInstance>(
  "card",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
      unique: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    listId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  { tableName: "cards" }
);

export default Card;
