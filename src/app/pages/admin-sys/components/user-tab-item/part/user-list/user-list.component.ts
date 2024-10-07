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
import { UserModel } from 'app/models';
import { PageState } from 'app/pages/admin-sys/state/PageState';
import { UserDialogComponent } from '../user-dialog/user-dialog.component';
import { IDialogUserData, IDialogUserResult } from '../user-dialog/types';
import { UserService } from 'app/pages/admin-sys/services';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [AsyncPipe, MatTabsModule, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatExpansionModule, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent {
  displayedColumns: string[] = ['userID', 'login', 'employeeID', 'actions'];

  /**
   * 
   */
  constructor(
    private userService: UserService,
    public pageState: PageState,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog
  ) { }


  /**
   * Click on button for edit item
   * 
   * @param user 
   */
  public onEditUser(user: UserModel) {
    const dialogRef: MatDialogRef<UserDialogComponent, IDialogUserResult>
      = this.dialog.open<UserDialogComponent, IDialogUserData, IDialogUserResult>(UserDialogComponent, {
        data: {
          dialogType: 'update',
          data: { userID: user.userID, login: user.login, employeeID: user.employeeID }
        },
      });

    dialogRef.afterClosed().subscribe(resultDialog => {
      if (resultDialog == undefined) return;

      this.userService.update(resultDialog.result).subscribe({
        next: resultModel => this.pageState.users.update(resultModel),
        error: (error) => this.showError(error),
      });
    });
  }


  /**
   * Click on button for delete item
   * 
   * @param user 
   */
  public onDeleteUser(user: UserModel) {
    const dialogRef = this.dialog.open<DialogConfirmComponent, IDialogConfirmData, IDialogConfirmResult>(DialogConfirmComponent, {
      data: {
        dialogTitle: 'Удалить запись',
        dialogContent: `Вы хотите удалить - "${user.login}" ?`,
        dialogBtnYesTitle: 'Удалить',
        dialogBtnNoTitle: 'Отмена'
      },
    });

    dialogRef.afterClosed().subscribe(resultDialog => {
      if (resultDialog?.result == 'yes') {
        if (user.userID == undefined) throw new Error('userID is undefined');

        this.userService.delete(user.userID).subscribe({
          next: () => this.pageState.users.delete(user),
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
   * Get name of employee by it ID. For viewed in html template
   * 
   * @param employeeID 
   * @returns 
   */
  getEmployeeFullNameByID(employeeID: number) {
    return this.pageState.employees.data().find(item => item.employeeID == employeeID)?.fullName
  }
}
