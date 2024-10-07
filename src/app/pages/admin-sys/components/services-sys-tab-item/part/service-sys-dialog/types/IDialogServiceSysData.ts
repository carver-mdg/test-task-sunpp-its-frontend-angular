import { ServiceSysModel } from "app/models";

export interface IDialogServiceSysData {
  dialogType: 'create' | 'update';
  data: ServiceSysModel;
}