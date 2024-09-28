import { DialogModule } from '@angular/cdk/dialog';
import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { UserService } from '../../services';
import { PageState } from '../../state/PageState';
import { UserDialogComponent } from './part/user-dialog/user-dialog.component';
import { IDialogUserData, IDialogUserResult } from './part/user-dialog/types';
import { UserListComponent } from './part/user-list/user-list.component';

@Component({
  selector: 'app-user-tab-item',
  standalone: true,
  imports: [
    AsyncPipe,
    MatTabsModule, MatTableModule, MatButtonModule, MatIconModule, FormsModule, DialogModule,
    MatFormFieldModule, MatInputModule, UserListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './user-tab-item.component.html',
  styleUrl: './user-tab-item.component.scss'
})
export class UserTabItemComponent {
  /**
     * 
     */
  constructor(
    private userService: UserService,
    private pageState: PageState,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) { }


  /**
   * Open dialog for create new user.
   */
  public openDialogCreateUser(): void {
    const dialogRef: MatDialogRef<UserDialogComponent, IDialogUserResult>
      = this.dialog.open<UserDialogComponent, IDialogUserData, IDialogUserResult>(UserDialogComponent, {
        data: {
          dialogType: 'create',
          user: { userID: undefined, login: '', employeeID: undefined },
        },
      });

    dialogRef.afterClosed().subscribe(resultDialog => {
      if (resultDialog == undefined) return;

      this.userService.save(resultDialog.result).subscribe({
        next: resultModel => this.pageState.users.add(resultModel),
        error: (error) => this.showError(error),
      });
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
}
