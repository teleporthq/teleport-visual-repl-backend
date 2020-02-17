import { User, Sequelize } from "../repositories/sequelize";

exports.findUserByEmailOrUsername = (eMail, username) => {
  return User.findOne({
    where: {
      [Sequelize.Op.or]: [{ eMail: eMail }, { Username: username }]
    }
  });
};

exports.createNewUser = (eMail, username, password) => {
  return User.create({
    Username: username,
    Password: password,
    eMail: eMail
  });
};

exports.findUserById = userId => {
  return User.findOne({
    where: { UserId: userId }
  });
};

exports.deleteUser = user => {
  user.destroy();
};
