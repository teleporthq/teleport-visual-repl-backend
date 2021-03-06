import { User } from "../repositories/sequelize";
import { Op } from "sequelize";
import { IUserModel } from "../interfaces/user";

interface UserParams {
  eMail: string;
  username: string;
  password: string;
}

class userRepository {
  static async findUserByEmailOrUsername(
    eMail: string,
    username: string
  ): Promise<IUserModel> {
    return User.findOne({
      where: {
        [Op.or]: [{ eMail: eMail }, { Username: username }]
      }
    });
  }

  static async createNewUser(params: UserParams): Promise<IUserModel> {
    const { username, eMail, password } = params;
    return User.create({
      Username: username,
      Password: password,
      eMail: eMail
    });
  }

  static async findUserById(userId: number): Promise<IUserModel> {
    return User.findOne({
      where: { UserId: userId }
    });
  }

  static deleteUser(user: IUserModel): void {
    user.destroy();
  }
}
export { userRepository };
