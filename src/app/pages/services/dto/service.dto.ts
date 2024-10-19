import { ServiceModel } from "app/models";


/**
 * Response from server
 */
export class ServiceResponseDTO {
  serviceId!: number;
  serviceName!: string;
  serviceDesc!: string;
  
  isHasAccess!: boolean;
  userRoleName!: string;
  userRoleNameRequested!: string;
  userRoleNameRequestedStatus!: string;

  static toModel(dto: ServiceResponseDTO): ServiceModel {
    return {
      serviceId: dto.serviceId,
      serviceName: dto.serviceName,
      serviceDesc: dto.serviceDesc,
      isHasAccess: dto.isHasAccess,
      userRoleName: dto.userRoleName,
      userRoleNameRequested: dto.userRoleNameRequested,
      userRoleNameRequestedStatus: dto.userRoleNameRequestedStatus,
    }
  }
}

/**
 * DTO for sending to server for create
 */
export class CreateServiceRequestDTO {
  serviceName!: string;
  serviceDesc!: string;

  isHasAccess!: boolean;
  userRoleName!: string;
  userRoleNameRequested!: string;
  userRoleNameRequestedStatus!: string;

  static toModel(dto: CreateServiceRequestDTO): ServiceModel {
    return {
      serviceId: undefined,
      serviceName: dto.serviceName,
      serviceDesc: dto.serviceDesc,
      isHasAccess: dto.isHasAccess,
      userRoleName: dto.userRoleName,
      userRoleNameRequested: dto.userRoleNameRequested,
      userRoleNameRequestedStatus: dto.userRoleNameRequestedStatus,
    }
  }
}

/**
 * DTO for sending to server for update
 */
export class UpdateServiceRequestDTO extends CreateServiceRequestDTO {
  serviceId!: number;

  static override toModel(dto: UpdateServiceRequestDTO): ServiceModel {
    let modelResult = super.toModel(dto);
    modelResult.serviceId = dto.serviceId;
    return modelResult;
  }
}