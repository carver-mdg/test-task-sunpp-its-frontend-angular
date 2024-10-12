import { UserModel } from "app/models";


/**
 * Response from server
 */
export class UserResponseDTO {
  userID!: number;
  userName!: string;
  employeeID!: number;

  static toModel(dto: UserResponseDTO): UserModel {
    return {
      userID: dto.userID,
      userName: dto.userName,
      employeeID: dto.employeeID,
    }
  }
}

/**
 * DTO for sending to server for create
 */
export class CreateUserRequestDTO {
  userName!: string;
  employeeID!: number;

  static toModel(dto: CreateUserRequestDTO): UserModel {
    return {
      userID: undefined,
      userName: dto.userName,
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