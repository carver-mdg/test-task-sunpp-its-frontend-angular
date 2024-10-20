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
import { ServiceModel, UserRoleInServiceModel } from 'app/models';
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
    this.servicesServices.loadList().subscribe({
      next: services => this.services.set(services),
    });

    this.servicesServices.loadUserRoleTypesInService().subscribe({
      next: userRoleTypes => this.userRoleTypes.set(userRoleTypes),
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
      if (resultDialog == undefined) return;

      // this.departmentService.saveDepartment(resultDialog.result).subscribe({
      //   next: resultModel => this.pageState.departments.add(resultModel),
      //   error: (error) => this.showError(error),
      // });
    });
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
