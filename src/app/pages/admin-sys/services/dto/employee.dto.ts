import { EmployeeModel } from "app/models";


/**
 * Response from server
 */
export class EmployeeResponseDTO {
  employeeId!: number;
  fullName!: string;
  staffUnitId!: number;

  static toModel(dto: EmployeeResponseDTO): EmployeeModel {
    return {
      employeeId: dto.employeeId,
      fullName: dto.fullName,
      staffUnitId: dto.staffUnitId,
    }
  }
}

/**
 * DTO for sending to server for create
 */
export class CreateEmployeeRequestDTO {
  fullName!: string;
  staffUnitId!: number;

  static toModel(dto: CreateEmployeeRequestDTO): EmployeeModel {
    return {
      employeeId: undefined,
      fullName: dto.fullName,
      staffUnitId: dto.staffUnitId
    }
  }
}

/**
 * DTO for sending to server for update
 */
export class UpdateEmployeeRequestDTO extends CreateEmployeeRequestDTO {
  employeeId!: number;

  static override toModel(dto: UpdateEmployeeRequestDTO): EmployeeModel {
    let response = super.toModel(dto);
    response.employeeId = dto.employeeId;
    return response;
  }
}