// Interfaces to receive from server
export interface ICreateDepartmentsReceivedDTO {
  departmentID: number;
  departmentName: string;
}
export interface IReadDepartmentsReceivedDTO extends ICreateDepartmentsReceivedDTO { }
export interface IUpdateDepartmentsReceivedDTO extends ICreateDepartmentsReceivedDTO { }


// Interfaces to sending to server
export interface ICreateDepartmentsSendingDTO {
  departmentName: string;
}
export interface IUpdateDepartmentsSendingDTO extends ICreateDepartmentsSendingDTO {
  departmentID: number;
}