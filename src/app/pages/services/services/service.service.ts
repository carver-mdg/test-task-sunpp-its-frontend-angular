import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/AppSettings';
import { AuthService } from 'app/auth/auth.service';
import { HistoryRequestAccessModel, ResponseRequestObtainUserRoleInServiceModel, ServiceModel, ServiceWaitingAccessModel, UserRoleInServiceModel } from 'app/models';
import { map, Observable } from 'rxjs';
import { CreateResponseRequestObtainUserRoleInServiceRequestDTO, HistoryRequestAccessResponseDTO, ServiceResponseDTO, ServicesWaitingAccessResponseDTO, UserRoleInServiceResponseDTO } from './dto';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  /**
   * 
   * @param http Angular http
   * @param appSettings settings of application
   */
  constructor(
    private http: HttpClient,
    private appSettings: AppSettings,
    private authService: AuthService,
  ) { }


  /**
   * Load services from the server
   * 
   * @returns list of models of services
   */
  public loadList(): Observable<ServiceModel[]> {
    const user_id: number = this.authService.getUserId();

    return this.http.get<ServiceResponseDTO[]>(`${this.appSettings.baseUrlAPI}/api/v1/services/viewer/${user_id}`).
      pipe(map((resultDTO) => {
        let services: ServiceModel[] = [];
        resultDTO.forEach(itemServiceDTO =>
          services.push(ServiceResponseDTO.toModel(itemServiceDTO))
        )
        return services;
      }))
  }


  /**
   * Loading services which waiting approved to access
   * 
   * @returns 
   */
  public loadServicesWaitingAccess(userId: number): Observable<ServiceWaitingAccessModel[]> {
    return this.http.get<ServicesWaitingAccessResponseDTO[]>(`${this.appSettings.baseUrlAPI}/api/v1/services/users/${userId}/access/response/waiting`)
      .pipe(map((resultDTO) => {
        let servicesWaitngAccess: ServiceWaitingAccessModel[] = [];
        resultDTO.forEach(
          itemServiceDTO =>
            servicesWaitngAccess.push(ServicesWaitingAccessResponseDTO.toModel(itemServiceDTO))
        );
        return servicesWaitngAccess;
      }))
  }


  /**
   * Load service item data from server
   * 
   * @returns 
   */
  public loadServiceItem(service_id: number): Observable<string> {
    const user_id: number = this.authService.getUserId();

    let options = {
      headers: new HttpHeaders({
        'Accept': 'text/plain'
      }),
      'responseType': 'text' as 'json'
    }

    return this.http.get<string>(`${this.appSettings.baseUrlAPI}/api/v1/services/${service_id}/users/${user_id}`, options);
  }


  /**
   * Load user role types in services
   * 
   * @returns 
   */
  public loadUserRoleTypesInService(): Observable<UserRoleInServiceModel[]> {
    return this.http.get<UserRoleInServiceResponseDTO[]>(`${this.appSettings.baseUrlAPI}/api/v1/services/users/types/roles`)
      .pipe(map((resultDTO) => {
        let userRolesInService: UserRoleInServiceModel[] = [];
        resultDTO.forEach(itemServiceDTO =>
          userRolesInService.push(UserRoleInServiceResponseDTO.toModel(itemServiceDTO))
        )
        return userRolesInService;
      }))
  }


  /**
   * Load history of request for getting role to service
   * 
   * @param service_id 
   * @returns 
   */
  public loadRequestsHistory(service_id: number): Observable<HistoryRequestAccessModel[]> {
    // @FIXME not released
    return this.http.get<HistoryRequestAccessResponseDTO[]>(`${this.appSettings.baseUrlAPI}/api/v1/services/${service_id}/history`)
      .pipe(map((resultDTO) => {
        let requestsHistory: HistoryRequestAccessModel[] = [];
        resultDTO.forEach(itemServiceDTO =>
          requestsHistory.push(HistoryRequestAccessResponseDTO.toModel(itemServiceDTO))
        )
        return requestsHistory;
      }))
  }


  /**
   * Submit a request to obtain a role in the service
   * 
   * @param serviceId 
   * @param userRole 
   * @returns 
   */
  public sendRequestObtainUserRoleInService(serviceId: number, userId: number, userRoleId: number): Observable<void> {
    return this.http.post<void>(`${this.appSettings.baseUrlAPI}/api/v1/services/${serviceId}/request/obtain/users/${userId}/role/${userRoleId}`, {});
  }


  /**
   * Send response access grant to service
   * 
   * @param serviceId 
   * @param fromUserId 
   * @param toUserId
   * @param status
   * @returns 
   */
  public sendResponseAccessGrantToService(serviceId: number, fromUserId: number, toUserId: number, responseOfUser: ResponseRequestObtainUserRoleInServiceModel): Observable<void> {
    let dtoToSending: CreateResponseRequestObtainUserRoleInServiceRequestDTO = {
      typeResponseName: responseOfUser.typeResponseName
    };

    return this.http.post<void>(`${this.appSettings.baseUrlAPI}/api/v1/services/${serviceId}/request/obtain/role/users/from/${fromUserId}/to/${toUserId}`, dtoToSending);
  }
}
