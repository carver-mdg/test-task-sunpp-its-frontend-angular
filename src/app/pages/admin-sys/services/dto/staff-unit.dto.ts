import { StaffUnitModel } from "app/models";


/**
 * Response from server
 */
export class StaffUnitResponseDTO {
  staffUnitId!: number;
  staffUnitName!: string;
  departmentId!: number;

  static toModel(dto: StaffUnitResponseDTO): StaffUnitModel {
    return {
      staffUnitId: dto.staffUnitId,
      staffUnitName: dto.staffUnitName,
      departmentId: dto.departmentId,
    }
  }
}

/**
 * DTO for sending to server for create
 */
export class CreateStaffUnitRequestDTO {
  staffUnitName!: string;
  departmentId!: number;

  static toModel(dto: CreateStaffUnitRequestDTO): StaffUnitModel {
    return {
      staffUnitId: undefined,
      staffUnitName: dto.staffUnitName,
      departmentId: dto.departmentId
    }
  }
}

/**
 * DTO for sending to server for update
 */
export class UpdateStaffUnitRequestDTO extends CreateStaffUnitRequestDTO {
  staffUnitId!: number;

  static override toModel(dto: UpdateStaffUnitRequestDTO): StaffUnitModel {
    let response = super.toModel(dto);
    response.staffUnitId = dto.staffUnitId;
    return response;
  }
}