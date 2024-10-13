import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AppSettings } from 'app/AppSettings';
import { ServiceSysModel } from 'app/models';
import { map, Observable, throwError } from 'rxjs';
import { CreateServiceSysRequestDTO, ServiceSysResponseDTO, UpdateServiceSysRequestDTO } from '../dto';

@Injectable({
  providedIn: 'root'
})
export class ServiceSysService {
  /**
   * 
   * @param http Angular http
   * @param appSettings settings of application
   */
  constructor(private http: HttpClient, private appSettings: AppSettings) { }


  /**
   * Load all system services from the server
   * 
   * @returns list of models of system services
   */
  public loadList(): Observable<ServiceSysModel[]> {
    return this.http.get<ServiceSysResponseDTO[]>(`${this.appSettings.baseUrlAPI}/api/v1/services/`).
      pipe(map((responseDTO) => {
        let services: ServiceSysModel[] = [];
        responseDTO.forEach(itemResponseDTO =>
          services.push(ServiceSysResponseDTO.toModel(itemResponseDTO))
        )
        return services;
      }))
  }


  /**
   * Save system service to the server
   * 
   * @param service model for sending to save
   * @returns model received from server
   */
  public save(service: ServiceSysModel): Observable<ServiceSysModel> {
    if (service.usersIdsAsRoleOwner == undefined || service.usersIdsAsRoleOwner.length === 0)
      return throwError(() => new Error('usersOwnerIDs is undefined or array is empty'));
    if (service.usersIdsAsRoleAdmin == undefined || service.usersIdsAsRoleAdmin.length === 0)
      return throwError(() => new Error('usersAdminIDs is undefined or array is empty'));

    let dtoToSending: CreateServiceSysRequestDTO = {
      serviceName: service.serviceName,
      serviceDesc: service.serviceDesc,
      usersIdsAsRoleUser: service.usersIdsAsRoleUser,
      usersIdsAsRoleOwner: service.usersIdsAsRoleOwner,
      usersIdsAsRoleAdmin: service.usersIdsAsRoleAdmin
    }

    return this.http.post<ServiceSysResponseDTO>(`${this.appSettings.baseUrlAPI}/api/v1/services/`, dtoToSending)
      .pipe(map(responseDTO => ServiceSysResponseDTO.toModel(responseDTO)));
  }


  /**
   * Update system service on the server
   * 
   * @param service model for sending to updating
   * @returns model received from server
   */
  public update(service: ServiceSysModel): Observable<ServiceSysModel> {
    if (service.serviceId == undefined)
      return throwError(() => new Error('serviceID is undefined'));
    if (service.usersIdsAsRoleOwner == undefined || service.usersIdsAsRoleOwner.length === 0)
      return throwError(() => new Error('usersOwnerIDs is undefined or array is empty'));
    if (service.usersIdsAsRoleAdmin == undefined || service.usersIdsAsRoleAdmin.length === 0)
      return throwError(() => new Error('usersAdminIDs is undefined or array is empty'));

    let dtoToSending: UpdateServiceSysRequestDTO = {
      serviceId: service.serviceId,
      serviceName: service.serviceName,
      serviceDesc: service.serviceDesc,
      usersIdsAsRoleUser: service.usersIdsAsRoleUser,
      usersIdsAsRoleOwner: service.usersIdsAsRoleOwner,
      usersIdsAsRoleAdmin: service.usersIdsAsRoleAdmin
    }

    return this.http.put<ServiceSysResponseDTO>(`${this.appSettings.baseUrlAPI}/api/v1/services/${service.serviceId}`, dtoToSending).
      pipe(map(responseDTO => ServiceSysResponseDTO.toModel(responseDTO)));
  }


  /**
   * Delete system service from the server
   * 
   * @param serviceID ID of item for deleting
   * @returns Observable of void
   */
  public delete(serviceID: number): Observable<void> {
    return this.http.delete<void>(`${this.appSettings.baseUrlAPI}/api/v1/services/${serviceID}`);
  }
}
