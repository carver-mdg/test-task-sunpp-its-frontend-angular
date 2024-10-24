import { ServiceWaitingAccessModel } from "app/models";

export class ServicesWaitingAccessResponseDTO {
  serviceId!: number;
  serviceName!: string;
  userId!: number;
  userName!: string;
  userRoleName!: string;

  static toModel(dto: ServicesWaitingAccessResponseDTO ): ServiceWaitingAccessModel {
    return {
      serviceId: dto.serviceId,
      serviceName:  dto.serviceName,
      userId: dto.userId,
      userName: dto.userName,
      userRoleName:  dto.userRoleName,
    }
  }
}