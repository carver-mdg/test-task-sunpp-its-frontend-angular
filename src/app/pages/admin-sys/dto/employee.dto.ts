import { EmployeeModel } from "app/models";


/**
 * Response from server
 */
export class EmployeeResponseDTO {
  employeeID!: number;
  fullName!: string;
  staffUnitID!: number;

  static toModel(dto: EmployeeResponseDTO): EmployeeModel {
    return {
      employeeID: dto.employeeID,
      fullName: dto.fullName,
      staffUnitID: dto.staffUnitID,
    }
  }
}

/**
 * DTO for sending to server for create
 */
export class CreateEmployeeRequestDTO {
  fullName!: string;
  staffUnitID!: number;

  static toModel(dto: CreateEmployeeRequestDTO): EmployeeModel {
    return {
      employeeID: undefined,
      fullName: dto.fullName,
      staffUnitID: dto.staffUnitID
    }
  }
}

/**
 * DTO for sending to server for update
 */
export class UpdateEmployeeRequestDTO extends CreateEmployeeRequestDTO {
  employeeID!: number;

  static override toModel(dto: UpdateEmployeeRequestDTO): EmployeeModel {
    let response = super.toModel(dto);
    response.employeeID = dto.employeeID;
    return response;
  }
}