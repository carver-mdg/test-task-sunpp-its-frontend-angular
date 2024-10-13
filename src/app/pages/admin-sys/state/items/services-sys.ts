import { Injectable, signal } from "@angular/core";
import { ServiceSysModel } from "app/models";
import { StateLoadingItem } from "../types";

@Injectable({
  providedIn: 'root'
})
export class ServicesSysState {
  data = signal<ServiceSysModel[]>([]);
  loadingState = signal<StateLoadingItem>(new StateLoadingItem());


  /**
   * Create list system services
   * 
   * @param services 
   */
  public create(services: ServiceSysModel[]) {
    this.data.set(services);
  }


  /**
   * Add system service to exist list of system services
   * 
   * @param service 
   */
  public add(service: ServiceSysModel) {
    this.data.set([...this.data(), service]);
  }


  /**
   * Update system service in exist list of system services
   * 
   * @param service 
 */
  update(service: ServiceSysModel) {
    this.data.set([...this.data().map(itemService => {
      if (itemService.serviceId == service.serviceId) {
        return {
          serviceId: service.serviceId,
          serviceName: service.serviceName,
          serviceDesc: service.serviceDesc,
          usersIdsAsRoleUser: service.usersIdsAsRoleUser,
          usersIdsAsRoleOwner: service.usersIdsAsRoleOwner,
          usersIdsAsRoleAdmin: service.usersIdsAsRoleAdmin
        }
      }
      return itemService;
    })]);
  }


  /**
   * Delete system service from exist list of system services
   * 
   * @param service 
   */
  delete(service: ServiceSysModel) {
    this.data.set([...this.data().filter(itemService =>
      itemService.serviceId != service.serviceId
    )]);
  }
}