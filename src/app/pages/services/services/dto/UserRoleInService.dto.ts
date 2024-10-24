import { UserRoleInServiceModel } from "app/models";

/**
 * Response from server
 */
export class UserRoleInServiceResponseDTO {
  roleId!: number;
  roleName!: string;

  static toModel(dto: UserRoleInServiceResponseDTO): UserRoleInServiceModel {
    return {
      roleId: dto.roleId,
      roleName: dto.roleName,
    }
  }
}