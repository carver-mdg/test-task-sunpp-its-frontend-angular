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
import { EmployeeService } from '../../services';
import { PageState } from '../../state/PageState';
import { EmployeeDialogComponent } from './part/employee-dialog/employee-dialog.component';
import { IDialogEmployeeData, IDialogEmployeeResult } from './part/employee-dialog/types';
import { EmployeeListComponent } from './part/employee-list/employee-list.component';

@Component({
  selector: 'app-employee-tab-item',
  standalone: true,
  imports: [
    AsyncPipe,
    MatTabsModule, MatTableModule, MatButtonModule, MatIconModule, FormsModule, DialogModule,
    MatFormFieldModule, MatInputModule, EmployeeListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './employee-tab-item.component.html',
  styleUrl: './employee-tab-item.component.scss'
})
export class EmployeeTabItemComponent {
  /**
     * 
     */
  constructor(
    private employeeService: EmployeeService,
    private pageState: PageState,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) { }


  /**
   * Open dialog for create new employee.
   */
  public openDialogCreateEmployee(): void {
    const dialogRef: MatDialogRef<EmployeeDialogComponent, IDialogEmployeeResult>
      = this.dialog.open<EmployeeDialogComponent, IDialogEmployeeData, IDialogEmployeeResult>(EmployeeDialogComponent, {
        data: {
          dialogType: 'create',
          employee: { employeeID: undefined, fullName: '', staffUnitID: undefined },
        },
      });

    dialogRef.afterClosed().subscribe(resultDialog => {
      if (resultDialog == undefined) return;

      this.employeeService.save(resultDialog.result).subscribe({
        next: resultModel => this.pageState.employees.add(resultModel),
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
