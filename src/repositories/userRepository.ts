import { User } from "../repositories/sequelize";
import { Op } from "sequelize";
import { IUserModel } from "../interfaces/user";

const findUserByEmailOrUsername = (
  eMail: string,
  username: string
): Promise<IUserModel> => {
  return User.findOne({
    where: {
      [Op.or]: [{ eMail: eMail }, { Username: username }]
    }
  });
};

const createNewUser = (
  eMail: string,
  username: string,
  password: string
): Promise<IUserModel> => {
  return User.create({
    Username: username,
    Password: password,
    eMail: eMail
  });
};

const findUserById = (userId: number): Promise<IUserModel> => {
  return User.findOne({
    where: { UserId: userId }
  });
};

// SEQUELIZE TYPE
const deleteUser = (user: IUserModel): void => {
  user.destroy();
};

const userRepository = {
  findUserByEmailOrUsername,
  createNewUser,
  findUserById,
  deleteUser
};
export { userRepository };
