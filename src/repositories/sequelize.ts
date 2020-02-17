import { Sequelize } from "sequelize";
import { UserModel } from "../models/User";
import { UIDLEntryModel } from "../models/UIDLEntry";

const sequelize = new Sequelize(
  process.env.DATABASE,
  process.env.DB_ADMIN,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

const User = UserModel(sequelize);

const UIDLEntry = UIDLEntryModel(sequelize);

User.hasMany(UIDLEntry, { onDelete: "cascade" });

sequelize.sync().then(() => {
  console.log(`Database in sync!`);
});

export { User, UIDLEntry };
