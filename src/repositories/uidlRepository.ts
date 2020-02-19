import { UIDLEntry } from "../repositories/sequelize";
import { IUidlEntryModel } from "../interfaces/uidl";

interface UIDLEntryParams {
  userId: number;
  uidlEntryString: string;
  entryName: string;
}

class uidlRepository {
  static async addNewEntry(params: UIDLEntryParams): Promise<IUidlEntryModel> {
    const { userId, uidlEntryString, entryName } = params;

    return UIDLEntry.create({
      UserUserId: userId,
      UIDLEntry: uidlEntryString,
      EntryName: entryName
    });
  }

  static saveEntryChanges(
    uidlEntry: IUidlEntryModel,
    uidlEntryString: string
  ): void {
    console.log("uidlEntryString: ", uidlEntryString);

    uidlEntry.UIDLEntry = uidlEntryString;
    uidlEntry.save({ fields: ["UIDLEntry"] });
  }

  static async findEntry(
    entryName: string,
    userId: number
  ): Promise<IUidlEntryModel> {
    const entry = UIDLEntry.findOne({
      where: {
        UserUserId: userId,
        EntryName: entryName
      }
    });

    return entry;
  }

  static async findAllEntryNamesByUser(
    userId: number
  ): Promise<IUidlEntryModel[]> {
    return UIDLEntry.findAll({
      attributes: ["EntryName"],
      where: {
        UserUserId: userId
      }
    });
  }

  static deleteEntry(uidlEntry: IUidlEntryModel): void {
    uidlEntry.destroy();
  }
}

export { uidlRepository };
