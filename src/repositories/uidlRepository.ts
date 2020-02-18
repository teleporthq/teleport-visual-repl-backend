import { UIDLEntry } from "../repositories/sequelize";
import { IUidlEntryModel } from "../interfaces/uidl";

interface UIDLEntryParams {
  userId: number;
  uidlEntryString: string;
  entryName: string;
}

const addNewEntry = (params: UIDLEntryParams): Promise<IUidlEntryModel> => {
  const { userId, uidlEntryString, entryName } = params;

  return UIDLEntry.create({
    UserUserId: userId,
    UIDLEntry: uidlEntryString,
    EntryName: entryName
  });
};

const saveEntryChanges = (
  uidlEntry: IUidlEntryModel,
  uidlEntryString: string
): void => {
  console.log("uidlEntryString: ", uidlEntryString);

  uidlEntry.UIDLEntry = uidlEntryString;
  uidlEntry.save({ fields: ["UIDLEntry"] });
};

const findEntry = (
  entryName: string,
  userId: number
): Promise<IUidlEntryModel> => {
  const entry = UIDLEntry.findOne({
    where: {
      UserUserId: userId,
      EntryName: entryName
    }
  });

  return entry;
};

const findAllEntryNamesByUser = (
  userId: number
): Promise<IUidlEntryModel[]> => {
  return UIDLEntry.findAll({
    attributes: ["EntryName"],
    where: {
      UserUserId: userId
    }
  });
};

const deleteEntry = (uidlEntry: IUidlEntryModel): void => {
  uidlEntry.destroy();
};

//Nu-i place lu' Ionut asa da ce sa-i facem
const uidlRepository = {
  addNewEntry,
  saveEntryChanges,
  findEntry,
  findAllEntryNamesByUser,
  deleteEntry
};

export { uidlRepository };
