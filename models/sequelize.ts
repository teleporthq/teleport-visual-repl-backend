const Sequelize = require("sequelize");
const UserModel = require("./User");
const UIDLEntryModel = require("./UIDLEntry");

const sequelize = new Sequelize("teleportVisualReplDb", "root", "Password4$", {
  host: "localhost",
  dialect: "mysql",
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const User = UserModel(sequelize, Sequelize);

const UIDLEntry = UIDLEntryModel(sequelize, Sequelize);

UIDLEntry.belongsTo(User);

sequelize.sync().then(() => {
  console.log(`Database in sync!`);
});

export { User, UIDLEntry, Sequelize };
