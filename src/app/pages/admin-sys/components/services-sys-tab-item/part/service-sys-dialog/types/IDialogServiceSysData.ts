import { ServiceSysModel } from "app/models";

export interface IDialogServiceSysData {
  dialogType: 'create' | 'update';
  serviceSys: ServiceSysModel;
}