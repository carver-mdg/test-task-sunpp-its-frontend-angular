import { ServiceSysModel } from "app/models";


/**
 * Response from server
 */
export class ServiceSysResponseDTO {
  serviceId!: number;
  serviceName!: string;
  serviceDesc!: string;
  usersIdsAsRoleUser!: number[];
  usersIdsAsRoleOwner!: number[];
  usersIdsAsRoleAdmin!: number[];

  static toModel(dto: ServiceSysResponseDTO): ServiceSysModel {
    return {
      serviceId: dto.serviceId,
      serviceName: dto.serviceName,
      serviceDesc: dto.serviceDesc,
      usersIdsAsRoleUser: dto.usersIdsAsRoleUser,
      usersIdsAsRoleOwner: dto.usersIdsAsRoleOwner,
      usersIdsAsRoleAdmin: dto.usersIdsAsRoleAdmin,
    }
  }
}

/**
 * DTO for sending to server for create
 */
export class CreateServiceSysRequestDTO {
  serviceName!: string;
  serviceDesc!: string;
  usersIdsAsRoleUser!: number[];
  usersIdsAsRoleOwner!: number[];
  usersIdsAsRoleAdmin!: number[];

  static toModel(dto: CreateServiceSysRequestDTO): ServiceSysModel {
    return {
      serviceId: undefined,
      serviceName: dto.serviceName,
      serviceDesc: dto.serviceDesc,
      usersIdsAsRoleUser: dto.usersIdsAsRoleUser,
      usersIdsAsRoleOwner: dto.usersIdsAsRoleOwner,
      usersIdsAsRoleAdmin: dto.usersIdsAsRoleAdmin,
    }
  }
}

/**
 * DTO for sending to server for update
 */
export class UpdateServiceSysRequestDTO extends CreateServiceSysRequestDTO {
  serviceId!: number;

  static override toModel(dto: UpdateServiceSysRequestDTO): ServiceSysModel {
    let modelResult = super.toModel(dto);
    modelResult.serviceId = dto.serviceId;
    return modelResult;
  }
}