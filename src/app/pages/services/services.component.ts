import { CommonModule } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/auth/auth.service';
import { ServiceModel, ServiceWaitingAccessModel, UserRoleInServiceModel } from 'app/models';
import { lastValueFrom } from 'rxjs';
import { DialogRequestUserRoleComponent } from './components/dialog-request-user-role/dialog-request-user-role.component';
import { IDialogRequestUserRoleData, IDialogRequestUserRoleResult } from './components/dialog-request-user-role/types';
import { DialogRequestsHistoryComponent } from './components/dialog-requests-history/dialog-requests-history.component';
import { IDialogRequestHistoryData, IDialogRequestHistoryResult } from './components/dialog-requests-history/types';
import { ServicesService } from './services';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [
    MatTabsModule, MatButtonModule, MatCardModule,
    CommonModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
})
export class ServicesComponent implements OnInit {
  services = signal<ServiceModel[]>([]);
  servicesWaitingAccess = signal<ServiceWaitingAccessModel[]>([]);
  userRoleTypes = signal<UserRoleInServiceModel[]>([]);


  /**
   * 
   * @param servicesServices 
   * @param router 
   * @param activatedRoute 
   * @param dialog 
   */
  constructor(
    private servicesServices: ServicesService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
  ) { }


  /**
   * Lifecycle hook that is called after Angular has initialized
   */
  ngOnInit() {
    // load services list
    this.servicesServices.loadList().subscribe({
      next: services => this.services.set(services),
    });

    // load possible user role types in the service
    this.servicesServices.loadUserRoleTypesInService().subscribe({
      next: userRoleTypes => this.userRoleTypes.set(userRoleTypes),
    });

    // load services list which waiting approve access
    this.servicesServices.loadServicesWaitingAccess(this.authService.getUserId()).subscribe({
      next: services => this.servicesWaitingAccess.set(services),
    });
  }


  /**
   * Click on button for open service
   * 
   * @param serviceId 
   */
  async onBtnClickOpenService(serviceId: number | undefined) {
    if (serviceId == undefined) throw new Error("ServiceID is undefined");

    // check if the user has access to service item
    try {
      await lastValueFrom(this.authService.isHasAccessUserToService(serviceId));
      this.router.navigate(['./', serviceId], { relativeTo: this.activatedRoute });
    } catch (err) {
      this.showError(err);
    }
  }


  /**
   * Click on button for open dialog with history of requests for roles
   * 
   * @param serviceId 
   */
  onBtnClickOpenRequestsHistory(serviceId: number | undefined) {
    if (serviceId == undefined) throw new Error('open history of requests: serviceId is undefined');

    this.servicesServices.loadRequestsHistory(serviceId).subscribe(
      {
        next: requestsHistoryList => {
          this.dialog.open<DialogRequestsHistoryComponent, IDialogRequestHistoryData, IDialogRequestHistoryResult>(DialogRequestsHistoryComponent, {
            data: {
              data: requestsHistoryList
            },
          });
        },
        error: err => this.showError(err),
      }
    );
  }


  // @BUG if the current user has the right to grant access, 
  // then in the "access requests" tab the new service will not appear, 
  // for this you need to reload the page. Or implement this by response of server
  /**
   * Click on button for open dialog with request for role
   * 
   * @param serviceId 
   */
  onBtnClickRequestUserRole(serviceId: number | undefined) {
    const dialogRef: MatDialogRef<DialogRequestUserRoleComponent, IDialogRequestUserRoleResult>
      = this.dialog.open<DialogRequestUserRoleComponent, IDialogRequestUserRoleData, IDialogRequestUserRoleResult>(DialogRequestUserRoleComponent, {
        data: {
          data: this.userRoleTypes(),
        },
      });

    dialogRef.afterClosed().subscribe(resultDialog => {
      if (resultDialog?.result == undefined) return;
      if (serviceId == undefined) throw new Error('onBtnClickRequestUserRole: serviceId is undefined');
      if (resultDialog.result.roleId == undefined) throw new Error('onBtnClickRequestUserRole: userRoleId is undefined');

      this.servicesServices.sendRequestObtainUserRoleInService(
        serviceId, this.authService.getUserId(), resultDialog.result.roleId
      ).subscribe({
        next: () => {
          // update the service, set value to service.userRoleNameRequested
          this.services.update(services =>
            services.map(service => {
              if (service.serviceId == serviceId) {
                const updatedService = service;
                updatedService.userRoleNameRequested = resultDialog.result && resultDialog.result.roleName || '';
                return updatedService;
              }
              return service;
            })
          );
        },
        error: (error) => this.showError(error),
      });
    });
  }


  /**
   * Click on button for approve access to service
   * 
   * @param serviceId 
   * @param toUserId
   */
  onBtnClickApproveAccessToService(serviceId: number | undefined, toUserId: number | undefined) {
    if (serviceId == undefined) throw new Error('onBtnClickApproveAccessToService: serviceId is undefined');
    if (toUserId == undefined) throw new Error('onBtnClickApproveAccessToService: userId is undefined');

    this.servicesServices.sendResponseAccessGrantToService(serviceId, this.authService.getUserId(), toUserId, { typeResponseName: 'approved' }).subscribe(
      {
        next: () => {
          this.servicesWaitingAccess.update(
            (services) =>
              services.filter(service => service.serviceId != serviceId)
          );
        },
        error: err => this.showError(err),
      }
    );
  }


  /**
 * Click on button for reject access to service
 * 
 * @param serviceId 
 * @param toUserId
 */
  onBtnClickRejectAccessToService(serviceId: number | undefined, toUserId: number | undefined) {
    if (serviceId == undefined) throw new Error('onBtnClickRejectAccessToService: serviceId is undefined');
    if (toUserId == undefined) throw new Error('onBtnClickRejectAccessToService: userId is undefined');

    this.servicesServices.sendResponseAccessGrantToService(serviceId, this.authService.getUserId(), toUserId, { typeResponseName: 'rejected' }).subscribe(
      {
        next: () => {
          this.servicesWaitingAccess.update(
            (services) =>
              services.filter(service => service.serviceId != serviceId)
          );
        },
        error: err => this.showError(err),
      }
    );
  }


  /**
   * Show error
   * 
   * @param error 
   */
  private showError(error: any) {
    let errMessage: string | undefined = undefined;
    if (error instanceof HttpErrorResponse) {
      if (error.status == HttpStatusCode.Forbidden)
        errMessage = "У вас нет доступа к сервису";
      else errMessage = error.message;
    }
    else
      errMessage = error;

    this.snackBar.open(errMessage?.toString() ?? 'unknown error', 'Ok', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-error'],
    });
  }

}
