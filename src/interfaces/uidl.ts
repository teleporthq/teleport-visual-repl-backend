// import { Json } from "sequelize/types/lib/utils";
import { Model, BuildOptions } from "sequelize";

export interface UIDLComponentName {
  EntryName: string;
}

export interface IUidlEntryModel extends Model {
  EntryId: number;
  EntryName: string;
  UIDLEntry: string;
}

export type IUidlEntryModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): IUidlEntryModel;
};
