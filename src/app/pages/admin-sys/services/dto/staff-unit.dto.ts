import { StaffUnitModel } from "app/models";


/**
 * Response from server
 */
export class StaffUnitResponseDTO {
  staffUnitID!: number;
  staffUnitName!: string;
  departmentID!: number;

  static toModel(dto: StaffUnitResponseDTO): StaffUnitModel {
    return {
      staffUnitID: dto.staffUnitID,
      staffUnitName: dto.staffUnitName,
      departmentID: dto.departmentID,
    }
  }
}

/**
 * DTO for sending to server for create
 */
export class CreateStaffUnitRequestDTO {
  staffUnitName!: string;
  departmentID!: number;

  static toModel(dto: CreateStaffUnitRequestDTO): StaffUnitModel {
    return {
      staffUnitID: undefined,
      staffUnitName: dto.staffUnitName,
      departmentID: dto.departmentID
    }
  }
}

/**
 * DTO for sending to server for update
 */
export class UpdateStaffUnitRequestDTO extends CreateStaffUnitRequestDTO {
  staffUnitID!: number;

  static override toModel(dto: UpdateStaffUnitRequestDTO): StaffUnitModel {
    let response = super.toModel(dto);
    response.staffUnitID = dto.staffUnitID;
    return response;
  }
}