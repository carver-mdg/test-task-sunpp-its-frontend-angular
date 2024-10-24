import { Routes } from '@angular/router';
import { isHasUserAccessToSystem, isHasUserAccessToServiceItem } from './auth/auth.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AdminSysComponent } from './pages/admin-sys/admin-sys.component';
import { AuthorizationComponent } from './pages/authorization/authorization.component';
import { ServicesComponent } from './pages/services/services.component';
import { ServiceItemPageComponent } from './pages/services/subpages/id/service-item-page/service-item-page.component';
import { AccessDeniedPageComponent } from './pages/access-denied-page/access-denied-page.component';

export const routes: Routes = [
  {
    path: 'authorization',
    component: AuthorizationComponent,
    data: {
      isShowHeader: false,
    }
  },
  {
    path: 'access-denied',
    component: AccessDeniedPageComponent,
  },
  {
    path: 'admin-sys',
    component: AdminSysComponent,
    canActivate: [isHasUserAccessToSystem],
    data: {
      roles: ["admin"]
    }
  },
  {
    path: 'services',
    canActivate: [isHasUserAccessToSystem],
    data: {
      roles: ["user"]
    },
    children: [
      { path: '', component: ServicesComponent },
      { path: ':id', component: ServiceItemPageComponent, canActivate: [isHasUserAccessToServiceItem] },
    ]
  },
  { path: '**', component: PageNotFoundComponent },
];
