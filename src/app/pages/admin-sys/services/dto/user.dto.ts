import { UserModel } from "app/models";


/**
 * Response from server
 */
export class UserResponseDTO {
  userId!: number;
  userName!: string;
  employeeId!: number;

  static toModel(dto: UserResponseDTO): UserModel {
    return {
      userId: dto.userId,
      userName: dto.userName,
      employeeId: dto.employeeId,
    }
  }
}

/**
 * DTO for sending to server for create
 */
export class CreateUserRequestDTO {
  userName!: string;
  employeeId!: number;

  static toModel(dto: CreateUserRequestDTO): UserModel {
    return {
      userId: undefined,
      userName: dto.userName,
      employeeId: dto.employeeId
    }
  }
}

/**
 * DTO for sending to server for update
 */
export class UpdateUserRequestDTO extends CreateUserRequestDTO {
  userId!: number;

  static override toModel(dto: UpdateUserRequestDTO): UserModel {
    let response = super.toModel(dto);
    response.userId = dto.userId;
    return response;
  }
}