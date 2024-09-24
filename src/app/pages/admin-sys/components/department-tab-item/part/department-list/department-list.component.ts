import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { DepartmentModel } from 'app/models';
import { DepartmentDialogComponent } from '../department-dialog/department-dialog.component';
import { DialogConfirmComponent } from 'app/components/dialog-confirm/dialog-confirm.component';
import { IDialogConfirmData, IDialogConfirmResult } from 'app/components/dialog-confirm/types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { IDialogDepartmentData, IDialogDepartmentResult } from '../department-dialog/types';
import { DepartmentService } from 'app/pages/admin-sys/services/department.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageState } from 'app/pages/admin-sys/state/PageState';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [AsyncPipe, MatTabsModule, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatExpansionModule, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss'
})
export class DepartmentListComponent {
  displayedColumns: string[] = ['departmentID', 'departmentName', 'actions'];


  /**
   * 
   */
  constructor(
    private departmentService: DepartmentService,
    public pageState: PageState,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog
  ) { }


  /**
   * 
   * @param department 
   */
  public onEditDepartment(department: DepartmentModel) {
    const dialogRef: MatDialogRef<DepartmentDialogComponent, IDialogDepartmentResult>
      = this.dialog.open<DepartmentDialogComponent, IDialogDepartmentData, IDialogDepartmentResult>(DepartmentDialogComponent, {
        data: {
          dialogType: 'update',
          department: { departmentID: department.departmentID, departmentName: department.departmentName }
        },
      });

    dialogRef.afterClosed().subscribe(resultDialog => {
      if (resultDialog == undefined) return

      this.departmentService.updateDepartment(resultDialog.result).subscribe({
        next: resultModel => this.pageState.departments.update(resultModel),
        error: (error) => this.showError(error),
      });
    });
  }

  /**
   * 
   * @param department 
   */
  public onDeleteDepartment(department: DepartmentModel) {
    const dialogRef = this.dialog.open<DialogConfirmComponent, IDialogConfirmData, IDialogConfirmResult>(DialogConfirmComponent, {
      data: {
        dialogTitle: 'Удалить запись',
        dialogContent: `Вы хотите удалить - "${department.departmentName}" ?`,
        dialogBtnYesTitle: 'Удалить',
        dialogBtnNoTitle: 'Отмена'
      },
    });

    dialogRef.afterClosed().subscribe(resultDialog => {
      if (resultDialog?.result == 'yes') {
        if (department.departmentID == undefined) throw new Error('departmentID is undefined');

        this.departmentService.deleteDepartment(department.departmentID).subscribe({
          next: () => this.pageState.departments.delete(department),
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

}
