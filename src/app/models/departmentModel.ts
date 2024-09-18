import { ICreateDepartmentsReceivedDTO, IReadDepartmentsReceivedDTO, IUpdateDepartmentsReceivedDTO } from "app/pages/admin-sys/dto";

export class DepartmentModel {
  departmentID: number | undefined;
  departmentName: string = '';

  static createFromDTO(dto: ICreateDepartmentsReceivedDTO | IReadDepartmentsReceivedDTO | IUpdateDepartmentsReceivedDTO): DepartmentModel {
    return {
      departmentID: dto.departmentID,
      departmentName: dto.departmentName
    }
  }
}