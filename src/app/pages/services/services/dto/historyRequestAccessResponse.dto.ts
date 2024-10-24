import { HistoryRequestAccessModel } from "app/models";

export class HistoryRequestAccessResponseDTO {
  serviceName!: string;
  requestedRole!: string;
  userNameCustomer!: string;
  userNameGivesAccess!: string;
  statusAccess!: string;
  dateCreated!: Date;

  static toModel(dto: HistoryRequestAccessResponseDTO ): HistoryRequestAccessModel {
    return {
      serviceName: dto.serviceName,
      requestedRole:  dto.requestedRole,
      userNameCustomer: dto.userNameCustomer,
      userNameGivesAccess: dto.userNameGivesAccess,
      statusAccess: dto.statusAccess,
      dateCreated:  dto.dateCreated,
    }
  }
}