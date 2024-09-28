import { UserModel } from "app/models";

export interface IDialogUserData {
  dialogType: 'create' | 'update';
  user: UserModel;
}