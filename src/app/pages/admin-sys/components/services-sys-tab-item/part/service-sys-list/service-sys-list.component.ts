import { AsyncPipe, JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { DialogConfirmComponent } from 'app/components/dialog-confirm/dialog-confirm.component';
import { IDialogConfirmData, IDialogConfirmResult } from 'app/components/dialog-confirm/types';
import { ServiceSysModel } from 'app/models';
import { ServiceSysService } from 'app/pages/admin-sys/services/service-sys.service';
import { PageState } from 'app/pages/admin-sys/state/PageState';
import { ServiceSysDialogComponent } from '../service-sys-dialog/service-sys-dialog.component';
import { IDialogServiceSysData, IDialogServiceSysResult } from '../service-sys-dialog/types';

@Component({
  selector: 'app-service-sys-list',
  standalone: true,
  imports: [AsyncPipe, MatTabsModule, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatExpansionModule, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './service-sys-list.component.html',
  styleUrl: './service-sys-list.component.scss'
})
export class ServiceSysListComponent {
  displayedColumns: string[] = ['serviceID', 'serviceName', 'serviceDesc', 'owner', 'admin', 'actions'];

  /**
   * 
   */
  constructor(
    private serviceSysService: ServiceSysService,
    public pageState: PageState,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog
  ) { }


  /**
   * Click on button for edit item
   * 
   * @param serviceSys 
   */
  public onEditServiceSys(serviceSys: ServiceSysModel) {
    const dialogRef: MatDialogRef<ServiceSysDialogComponent, IDialogServiceSysResult>
      = this.dialog.open<ServiceSysDialogComponent, IDialogServiceSysData, IDialogServiceSysResult>(ServiceSysDialogComponent, {
        data: {
          dialogType: 'update',
          serviceSys: {
            serviceId: serviceSys.serviceId,
            serviceName: serviceSys.serviceName,
            serviceDesc: serviceSys.serviceDesc,
            usersIdsAsRoleUser: serviceSys.usersIdsAsRoleUser,
            usersIdsAsRoleOwner: serviceSys.usersIdsAsRoleOwner,
            usersIdsAsRoleAdmin: serviceSys.usersIdsAsRoleAdmin
          }
        },
      });

    dialogRef.afterClosed().subscribe(resultDialog => {
      if (resultDialog == undefined) return;

      this.serviceSysService.update(resultDialog.result).subscribe({
        next: resultModel => this.pageState.servicesSys.update(resultModel),
        error: (error) => this.showError(error),
      });
    });
  }


  /**
   * Click on button for delete item
   * 
   * @param serviceSys 
   */
  public onDeleteServiceSys(serviceSys: ServiceSysModel) {
    const dialogRef = this.dialog.open<DialogConfirmComponent, IDialogConfirmData, IDialogConfirmResult>(DialogConfirmComponent, {
      data: {
        dialogTitle: 'Удалить запись',
        dialogContent: `Вы хотите удалить - "${serviceSys.serviceName}" ?`,
        dialogBtnYesTitle: 'Удалить',
        dialogBtnNoTitle: 'Отмена'
      },
    });

    dialogRef.afterClosed().subscribe(resultDialog => {
      if (resultDialog?.result == 'yes') {
        if (serviceSys.serviceId == undefined) throw new Error('serviceID is undefined');

        this.serviceSysService.delete(serviceSys.serviceId).subscribe({
          next: () => this.pageState.servicesSys.delete(serviceSys),
          error: (error) => this.showError(error),
        });
      }
    });
  }


  /**
   * Show error
   * 
   * @param error 
   */
  private showError(error: any) {
    let errMessage: string | undefined = undefined;
    if (error instanceof HttpErrorResponse)
      errMessage = error.message;
    else
      errMessage = error;

    this.snackBar.open(errMessage?.toString() ?? 'unknown error', 'Ok', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-error'],
    });
  }


  /**
   * Get full names of employees by it IDs. For viewed in html template
   * 
   * @param userIDs 
   * @returns
   */
  public getEmployeesFullNamesByUsersIDs(userIDs: number[]): string {
    return this.pageState.users.data()
      .filter(user => user.userID == userIDs.find(userId => userId == user.userID))
      .map(user =>
        this.pageState.employees.data()
          .find(employee => employee.employeeID == user.employeeID)?.fullName)
      .join(', ');
  }


  /**
   * Get logins of users by it IDs. For viewed in html template
   * 
   * @param userIDs 
   * @returns 
   */
  public getLoginsByUsersIDs(userIDs: number[]): string {
    return this.pageState.users.data()
      .filter(user => user.userID == userIDs.find(userId => userId == user.userID))
      .map(user => user.login)
      .join(', ');
  }
}
