import { Sequelize, DataTypes } from "sequelize";
import { IUidlEntryModelStatic } from "../interfaces/uidl";

export const UIDLEntryModel = (sequelize: Sequelize) => {
  const UIDLEntry = <IUidlEntryModelStatic>sequelize.define("UIDLEntries", {
    EntryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    EntryName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    UIDLEntry: {
      type: DataTypes.JSON
    }
  });

  return UIDLEntry;
};
