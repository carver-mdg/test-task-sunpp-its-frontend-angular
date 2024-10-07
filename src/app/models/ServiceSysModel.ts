export class ServiceSysModel {
  serviceId: number | undefined;
  serviceName: string = '';
  serviceDesc: string = '';

  // @NOTE users with roles are better done using a interface rather than multiple variables
  /*
    As example see below:

    interface IUserWithRoleInService {
      roleName: string;
      userId: number;
    }

    and after this variable may be declared as `users: IUserWithRoleInService[] = []`
    instead of the one described below
  */
  usersIdsAsRoleUser: number[] = [];
  usersIdsAsRoleOwner: number[] = [];
  usersIdsAsRoleAdmin: number[] = [];
}