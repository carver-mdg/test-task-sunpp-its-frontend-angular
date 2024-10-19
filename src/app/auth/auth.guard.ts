import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { lastValueFrom, of } from 'rxjs';


/**
 * 
 * @param route 
 * @param state 
 * @returns 
 */
export const hasRoleGuard: CanActivateFn = async (route, state) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  const isLogged = await lastValueFrom(authService.check());
  if(!isLogged) return router.navigate(['authorization']);

  const userRole: string = authService.getUserRoleName();
  const expectedRoles: string[] = route.data['roles'];

  const hasRole: boolean = expectedRoles.some((role) => userRole === role);

  return hasRole || router.navigate(['authorization']);
};


/**
 * 
 * @param route 
 * @param state 
 * @returns 
 */
export const isHasUserAccessToService: CanActivateFn = async (route, state) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  const isLogged = await lastValueFrom(authService.check());
  if(!isLogged) return router.navigate(['authorization']);

  const serviceId = route.paramMap.get('id');
  if(serviceId == null) throw new Error('serviceId is null (it getting from url)');

  try {
    // to catch AccessDeniedException
    await lastValueFrom(authService.isHasAccessUserToService(parseInt(serviceId)));
    return true;
  }
  catch(err) {
    router.navigate(['access-denied']);
    return false;
  }
}