import { Sequelize, DataTypes } from "sequelize";
import { IUserModelStatic } from "../interfaces/user";

export const UserModel = (sequelize: Sequelize) => {
  const User = <IUserModelStatic>sequelize.define("Users", {
    UserId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    Username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    Password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    eMail: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return User;
};
