import { Routes } from '@angular/router';
import { hasRoleGuard } from './has-role.guard';
import { Role } from './role';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AdminSysComponent } from './pages/admin-sys/admin-sys.component';
import { AuthorizationComponent } from './pages/authorization/authorization.component';
import { ServicesComponent } from './pages/services/services.component';

export const routes: Routes = [
  // { path: '', redirectTo: '/heroes-list', pathMatch: 'full' },
  {
    path: 'authorization',
    component: AuthorizationComponent,
    data: {
      isShowHeader: false,
    }
  },
  {
    path: 'admin-sys',
    component: AdminSysComponent,
    canActivate: [hasRoleGuard],
    data: {
      // roles: [Role.ADMIN_SYS]
      roles: [Role.ADMIN_SYS, Role.USER]
    }
  },
  { path: 'services', component: ServicesComponent },
  { path: '**', component: PageNotFoundComponent },
];
