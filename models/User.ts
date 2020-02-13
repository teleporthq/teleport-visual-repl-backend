module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define("Users", {
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
