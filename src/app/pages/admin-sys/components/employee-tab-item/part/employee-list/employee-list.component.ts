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
import { EmployeeModel } from 'app/models';
import { EmployeeService } from 'app/pages/admin-sys/services/employee.service';
import { PageState } from 'app/pages/admin-sys/state/PageState';
import { EmployeeDialogComponent } from '../employee-dialog/employee-dialog.component';
import { IDialogEmployeeData, IDialogEmployeeResult } from '../employee-dialog/types';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [AsyncPipe, MatTabsModule, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatExpansionModule, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.scss'
})
export class EmployeeListComponent {
  displayedColumns: string[] = ['employeeID', 'fullName', 'staffUnitID', 'actions'];

  /**
   * 
   */
  constructor(
    private employeeService: EmployeeService,
    public pageState: PageState,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog
  ) { }


  /**
   * Click on button for edit item
   * 
   * @param employee 
   */
  public onEditEmployee(employee: EmployeeModel) {
    const dialogRef: MatDialogRef<EmployeeDialogComponent, IDialogEmployeeResult>
      = this.dialog.open<EmployeeDialogComponent, IDialogEmployeeData, IDialogEmployeeResult>(EmployeeDialogComponent, {
        data: {
          dialogType: 'update',
          employee: { employeeID: employee.employeeID, fullName: employee.fullName, staffUnitID: employee.staffUnitID }
        },
      });

    dialogRef.afterClosed().subscribe(resultDialog => {
      if (resultDialog == undefined) return;

      this.employeeService.update(resultDialog.result).subscribe({
        next: resultModel => this.pageState.employees.update(resultModel),
        error: (error) => this.showError(error),
      });
    });
  }


  /**
   * Click on button for delete item
   * 
   * @param employee 
   */
  public onDeleteEmployee(employee: EmployeeModel) {
    const dialogRef = this.dialog.open<DialogConfirmComponent, IDialogConfirmData, IDialogConfirmResult>(DialogConfirmComponent, {
      data: {
        dialogTitle: 'Удалить запись',
        dialogContent: `Вы хотите удалить - "${employee.fullName}" ?`,
        dialogBtnYesTitle: 'Удалить',
        dialogBtnNoTitle: 'Отмена'
      },
    });

    dialogRef.afterClosed().subscribe(resultDialog => {
      if (resultDialog?.result == 'yes') {
        if (employee.employeeID == undefined) throw new Error('employeeID is undefined');

        this.employeeService.delete(employee.employeeID).subscribe({
          next: () => this.pageState.employees.delete(employee),
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
   * Get name of staff unit by it ID. For viewed in html template
   * 
   * @param staffUnitID 
   * @returns 
   */
  getStaffUnitByID(staffUnitID: number) {
    return this.pageState.staffUnits.data().find(item => item.staffUnitID == staffUnitID)?.staffUnitName
  }


  /**
  * Get department name of staff unit
  * 
  * @param staffUnit 
  * @returns 
  */
  getDepartmentNameByStaffUnit(staffUnitID: number) {
    return this.pageState.departments.data().find(
      departmentItem => departmentItem.departmentID == this.pageState.staffUnits.data().find(
        item => item.staffUnitID == staffUnitID
      )?.departmentID
    )?.departmentName;
  }
}
