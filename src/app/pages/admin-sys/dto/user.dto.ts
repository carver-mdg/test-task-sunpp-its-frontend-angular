import { UserModel } from "app/models";


/**
 * Response from server
 */
export class UserResponseDTO {
  userID!: number;
  login!: string;
  employeeID!: number;

  static toModel(dto: UserResponseDTO): UserModel {
    return {
      userID: dto.userID,
      login: dto.login,
      employeeID: dto.employeeID,
    }
  }
}

/**
 * DTO for sending to server for create
 */
export class CreateUserRequestDTO {
  login!: string;
  employeeID!: number;

  static toModel(dto: CreateUserRequestDTO): UserModel {
    return {
      userID: undefined,
      login: dto.login,
      employeeID: dto.employeeID
    }
  }
}

/**
 * DTO for sending to server for update
 */
export class UpdateUserRequestDTO extends CreateUserRequestDTO {
  userID!: number;

  static override toModel(dto: UpdateUserRequestDTO): UserModel {
    let response = super.toModel(dto);
    response.userID = dto.userID;
    return response;
  }
}