import { Model, DataTypes, Optional } from "sequelize";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import sequelize from "../config/database";

interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  // role: "customer" | "admin";
  // avatar?: {
  //   url: string;
  //   public_alt: string;
  // };
  // resetPasswordToken?: string;
  // resetPasswordExpire?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IUserCreationAttributes
  extends Optional<
    IUser,
    | "id"
    // | "role"
    // | "avatar"
    // | "resetPasswordToken"
    // | "resetPasswordExpire"
    | "createdAt"
    | "updatedAt"
  > {}

class User extends Model<IUser, IUserCreationAttributes> implements IUser {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  async matchPassword(enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "users",
    timestamps: true,
    hooks: {
      beforeSave: async (user: User) => {
        if (user.changed("password")) {
          const salt = await bcrypt.genSalt(10);
          user.password = await bcrypt.hash(user.password, salt);
        }
      },
    },
  }
);

export { User };
