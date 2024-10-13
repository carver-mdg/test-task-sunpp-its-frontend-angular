import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { lastValueFrom } from 'rxjs';

export const hasRoleGuard: CanActivateFn = async (route, state) => {
  const router: Router = inject(Router);
  const authService: AuthService = inject(AuthService);

  // const is = await lastValueFrom(authService.check());

  const userRole: string = authService.getUserRole();
  const expectedRoles: string[] = route.data['roles'];

  const hasRole: boolean = expectedRoles.some((role) => userRole === role);
  console.log(hasRole);

  return hasRole || router.navigate(['authorization']);
};