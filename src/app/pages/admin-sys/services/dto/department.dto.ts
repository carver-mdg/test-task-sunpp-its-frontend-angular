import { DepartmentModel } from "app/models";


/**
 * Response from server
 */
export class DepartmentResponseDTO {
  departmentID!: number;
  departmentName!: string;

  static toModel(dto: DepartmentResponseDTO): DepartmentModel {
    return {
      departmentID: dto.departmentID,
      departmentName: dto.departmentName
    }
  }
}

/**
 * DTO for sending to server for create
 */
export class CreateDepartmentRequestDTO {
  departmentName!: string;

  static toModel(dto: CreateDepartmentRequestDTO): DepartmentModel {
    return {
      departmentID: undefined,
      departmentName: dto.departmentName
    }
  }
}

/**
 * DTO for sending to server for update
 */
export class UpdateDepartmentRequestDTO extends CreateDepartmentRequestDTO {
  departmentID!: number;

  static override toModel(dto: UpdateDepartmentRequestDTO): DepartmentModel {
    let response = super.toModel(dto);
    response.departmentID = dto.departmentID;
    return response;
  }
}