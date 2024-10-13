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
import { StaffUnitModel } from 'app/models';
import { StaffUnitService } from 'app/pages/admin-sys/services/staff-unit.service';
import { PageState } from 'app/pages/admin-sys/state/PageState';
import { StaffUnitDialogComponent } from '../staff-unit-dialog/staff-unit-dialog.component';
import { IDialogStaffUnitData, IDialogStaffUnitResult } from '../staff-unit-dialog/types';

@Component({
  selector: 'app-staff-unit-list',
  standalone: true,
  imports: [AsyncPipe, MatTabsModule, MatTableModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, MatExpansionModule, JsonPipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './staff-unit-list.component.html',
  styleUrl: './staff-unit-list.component.scss'
})
export class StaffUnitListComponent {
  displayedColumns: string[] = ['staffUnitID', 'staffUnitName', 'departmentID', 'actions'];

  /**
   * 
   */
  constructor(
    private staffUnitService: StaffUnitService,
    public pageState: PageState,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog
  ) { }


  /**
   * Click on button for edit item
   * 
   * @param staffUnit 
   */
  public onEditStaffUnit(staffUnit: StaffUnitModel) {
    const dialogRef: MatDialogRef<StaffUnitDialogComponent, IDialogStaffUnitResult>
      = this.dialog.open<StaffUnitDialogComponent, IDialogStaffUnitData, IDialogStaffUnitResult>(StaffUnitDialogComponent, {
        data: {
          dialogType: 'update',
          data: { staffUnitID: staffUnit.staffUnitID, staffUnitName: staffUnit.staffUnitName, departmentID: staffUnit.departmentID }
        },
      });

    dialogRef.afterClosed().subscribe(resultDialog => {
      if (resultDialog == undefined) return;

      this.staffUnitService.update(resultDialog.result).subscribe({
        next: resultModel => this.pageState.staffUnits.update(resultModel),
        error: (error) => this.showError(error),
      });
    });
  }


  /**
   * Click on button for delete item
   * 
   * @param staffUnit 
   */
  public onDeleteStaffUnit(staffUnit: StaffUnitModel) {
    const dialogRef = this.dialog.open<DialogConfirmComponent, IDialogConfirmData, IDialogConfirmResult>(DialogConfirmComponent, {
      data: {
        dialogTitle: 'Удалить запись',
        dialogContent: `Вы хотите удалить - "${staffUnit.staffUnitName}" ?`,
        dialogBtnYesTitle: 'Удалить',
        dialogBtnNoTitle: 'Отмена'
      },
    });

    dialogRef.afterClosed().subscribe(resultDialog => {
      if (resultDialog?.result == 'yes') {
        if (staffUnit.staffUnitID == undefined) throw new Error('staffUnitID is undefined');

        this.staffUnitService.delete(staffUnit.staffUnitID).subscribe({
          next: () => this.pageState.staffUnits.delete(staffUnit),
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
   * Get name of department by it ID. For viewed in html template
   * 
   * @param departmentID 
   * @returns 
   */
  getDepartmentByID(departmentID: number) {
    return this.pageState.departments.data().find(item => item.departmentID == departmentID)?.departmentName
  }
}
