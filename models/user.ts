import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";

// Attributes in DB
export interface UserAttributes {
  id: number;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// For creation (id is optional)
export interface UserCreationAttributes
  extends Optional<UserAttributes, "id"> {}

// Model type
export interface UserInstance
  extends Model<UserAttributes, UserCreationAttributes>,
    UserAttributes {}

const User = sequelize.define<UserInstance>(
  "User",
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    email: { type: DataTypes.STRING(128), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(128), allowNull: false },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);

export default User;
