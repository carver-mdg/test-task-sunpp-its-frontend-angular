import { EmployeeModel } from "app/models";

export interface IDialogEmployeeData {
  dialogType: 'create' | 'update';
  employee: EmployeeModel;
}