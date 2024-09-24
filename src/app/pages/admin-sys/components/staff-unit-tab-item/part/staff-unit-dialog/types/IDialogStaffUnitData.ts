import { StaffUnitModel } from "app/models";

export interface IDialogStaffUnitData {
  dialogType: 'create' | 'update';
  staffUnit: StaffUnitModel;
}