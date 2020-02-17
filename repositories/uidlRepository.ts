import { UIDLEntry } from "../repositories/sequelize";

exports.addNewEntry = (userId: number, uidlEntry, entryName: string) => {
  return UIDLEntry.create({
    UserUserId: userId,
    UIDLEntry: uidlEntry,
    EntryName: entryName
  });
};

exports.saveEntryChanges = uidlEntry => {
  uidlEntry.UIDLEntry = uidlEntry;
  uidlEntry.save({ fields: ["UIDLEntry"] });
};

exports.findEntry = (entryName: string, userId: number) => {
  const entry = UIDLEntry.findOne({
    where: {
      UserUserId: userId,
      EntryName: entryName
    }
  });

  return entry;
};

exports.findAllEntryNamesByUser = (userId: number) => {
  return UIDLEntry.findAll({
    attributes: ["EntryName"],
    where: {
      UserUserId: userId
    }
  });
};

exports.deleteEntry = entry => {
  entry.destroy();
};
