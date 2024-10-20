import { AuthModel } from "app/models";

export class AuthResponseDTO {
  userId!: number;
  userName!: string;
  userRoleId!: number;
  userRoleName!: string;

  static toModel(dto: AuthResponseDTO): AuthModel {
    return {
      userId: dto.userId,
      userName: dto.userName,
      userRoleId: dto.userRoleId,
      userRoleName: dto.userRoleName,
    }
  }
}

export class AuthRequestDTO {
  userName!: string;
  password!: string;
}