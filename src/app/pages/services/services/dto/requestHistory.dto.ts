import { RequestHistoryModel } from "app/models";

export class RequestHistoryResponseDTO {
  requestHistoryId: number | undefined;
  statusName: string = '';
  userNamesThanGavePermission: string = '';
  date: Date | undefined;

  static toModel(dto: RequestHistoryResponseDTO ): RequestHistoryModel {
    return {
      requestHistoryId: dto.requestHistoryId,
      statusName:  dto.statusName,
      userNamesThanGavePermission: dto.userNamesThanGavePermission,
      date:  dto.date,
    }
  }
}