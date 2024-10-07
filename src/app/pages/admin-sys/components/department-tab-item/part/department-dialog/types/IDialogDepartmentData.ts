import { DepartmentModel } from "app/models";

export interface IDialogDepartmentData {
  dialogType: 'create' | 'update';
  data: DepartmentModel;
}