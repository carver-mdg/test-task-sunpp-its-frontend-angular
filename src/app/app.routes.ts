import { Routes } from '@angular/router';
import { hasRoleGuard } from './auth/has-role.guard';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { AdminSysComponent } from './pages/admin-sys/admin-sys.component';
import { AuthorizationComponent } from './pages/authorization/authorization.component';
import { ServicesComponent } from './pages/services/services.component';

export const routes: Routes = [
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
      roles: ["admin"]
    }
  },
  { 
    path: 'services', 
    component: ServicesComponent,
    canActivate: [hasRoleGuard],
    data: {
      roles: ["admin", "user"]
    }
  },
  { path: '**', component: PageNotFoundComponent },
];
