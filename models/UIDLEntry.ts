module.exports = (sequelize, DataTypes) => {
  var UIDLEntry = sequelize.define("UIDLEntries", {
    EntryId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    UIDLEntry: {
      type: DataTypes.JSON
    }
  });

  return UIDLEntry;
};
