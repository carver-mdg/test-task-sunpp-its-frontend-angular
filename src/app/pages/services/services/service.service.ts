import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/AppSettings';
import { AuthService } from 'app/auth/auth.service';
import { RequestHistoryModel, ServiceModel, UserRoleInServiceModel } from 'app/models';
import { map, Observable } from 'rxjs';
import { RequestHistoryResponseDTO, ServiceResponseDTO, UserRoleInServiceResponseDTO } from '../dto';

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
   * Load service item data from server
   * 
   * @returns 
   */
  public loadServiceItem(service_id: number): Observable<string> {
    const user_id: number = this.authService.getUserId();
    
    let options = {
      headers: new HttpHeaders({
        'Accept':'text/plain'
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
  public loadRequestsHistory(service_id: number): Observable<RequestHistoryModel[]> {
    return this.http.get<RequestHistoryResponseDTO[]>(`${this.appSettings.baseUrlAPI}/api/v1/services/${service_id}/history`)
      .pipe(map((resultDTO) => {
        let requestsHistory: RequestHistoryModel[] = [];
        resultDTO.forEach(itemServiceDTO =>
          requestsHistory.push(RequestHistoryResponseDTO.toModel(itemServiceDTO))
        )
        return requestsHistory;
      }))
  }
}
