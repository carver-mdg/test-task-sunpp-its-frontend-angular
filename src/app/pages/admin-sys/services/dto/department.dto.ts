import { DepartmentModel } from "app/models";


/**
 * Response from server
 */
export class DepartmentResponseDTO {
  departmentId!: number;
  departmentName!: string;

  static toModel(dto: DepartmentResponseDTO): DepartmentModel {
    return {
      departmentId: dto.departmentId,
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
      departmentId: undefined,
      departmentName: dto.departmentName
    }
  }
}

/**
 * DTO for sending to server for update
 */
export class UpdateDepartmentRequestDTO extends CreateDepartmentRequestDTO {
  departmentId!: number;

  static override toModel(dto: UpdateDepartmentRequestDTO): DepartmentModel {
    let response = super.toModel(dto);
    response.departmentId = dto.departmentId;
    return response;
  }
}