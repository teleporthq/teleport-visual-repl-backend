import { Model, BuildOptions } from "sequelize";

export interface IUserModel extends Model {
  UserId: number;
  Username: string;
  Password: string;
  eMail: string;
}

export type IUserModelStatic = typeof Model & {
  new (values?: object, options?: BuildOptions): IUserModel;
};
