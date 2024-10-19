import { Component, ChangeDetectionStrategy, OnInit, signal } from '@angular/core';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { ServicesService } from './services';
import { ServiceModel, UserRoleInServiceModel } from 'app/models';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DialogRequestUserRoleComponent } from './components/dialog-request-user-role/dialog-request-user-role.component';
import { IDialogRequestUserRoleData, IDialogRequestUserRoleResult } from './components/dialog-request-user-role/types';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { DialogRequestsHistoryComponent } from './components/dialog-requests-history/dialog-requests-history.component';
import { IDialogRequestHistoryResult, IDialogRequestHistoryData } from './components/dialog-requests-history/types';

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
    private readonly dialog: MatDialog,
    private readonly snackBar: MatSnackBar,
  ) { }


  /**
   * Lifecycle hook that is called after Angular has initialized
   */
  ngOnInit() {
    this.servicesServices.loadList().subscribe({
      next: services => this.services.set(services),
      // error: (err) => this.pageState.employees.loadingState.set(StateLoadingItem.error(err)),
      // complete: () => this.pageState.employees.loadingState.set(StateLoadingItem.complete())
    });

    this.servicesServices.loadUserRoleTypesInService().subscribe({
      next: userRoleTypes => this.userRoleTypes.set(userRoleTypes),
      // error: (err) => this.pageState.employees.loadingState.set(StateLoadingItem.error(err)),
      // complete: () => this.pageState.employees.loadingState.set(StateLoadingItem.complete())
    });
  }


  /**
   * Click on button for open service
   * 
   * @param serviceId 
   */
  onBtnClickOpenService(serviceId: number | undefined) {
    if (serviceId == undefined) throw new Error("ServiceID is undefined");

    this.servicesServices.loadServiceItem(serviceId).subscribe(
      {
        next: data => {
          this.router.navigate(['./', serviceId, { data }], { relativeTo: this.activatedRoute });
        },
        error: err => this.showError(err),
      }
    );
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
