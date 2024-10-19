export class ServiceModel {
  serviceId: number | undefined;
  serviceName: string = '';
  serviceDesc: string = '';

  isHasAccess: boolean = false;
  userRoleName: string = '';
  userRoleNameRequested: string = '';
  userRoleNameRequestedStatus: string = '';
}