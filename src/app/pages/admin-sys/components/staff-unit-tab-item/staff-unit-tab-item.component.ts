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
import { StaffUnitService } from '../../services/staff-unit.service';
import { PageState } from '../../state/PageState';
import { StaffUnitDialogComponent } from './part/staff-unit-dialog/staff-unit-dialog.component';
import { IDialogStaffUnitData, IDialogStaffUnitResult } from './part/staff-unit-dialog/types';
import { StaffUnitListComponent } from './part/staff-unit-list/staff-unit-list.component';

@Component({
  selector: 'app-staff-unit-tab-item',
  standalone: true,
  imports: [
    AsyncPipe,
    MatTabsModule, MatTableModule, MatButtonModule, MatIconModule, FormsModule, DialogModule,
    MatFormFieldModule, MatInputModule, StaffUnitListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './staff-unit-tab-item.component.html',
  styleUrl: './staff-unit-tab-item.component.scss'
})
export class StaffUnitTabItemComponent {
  /**
     * 
     */
  constructor(
    private staffUnitService: StaffUnitService,
    private pageState: PageState,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) { }


  /**
   * Open dialog for create new staff unit.
   */
  public openDialogCreateStaffUnit(): void {
    const dialogRef: MatDialogRef<StaffUnitDialogComponent, IDialogStaffUnitResult>
      = this.dialog.open<StaffUnitDialogComponent, IDialogStaffUnitData, IDialogStaffUnitResult>(StaffUnitDialogComponent, {
        data: {
          dialogType: 'create',
          staffUnit: { staffUnitID: undefined, staffUnitName: '', departmentID: undefined },
        },
      });

    dialogRef.afterClosed().subscribe(resultDialog => {
      if (resultDialog == undefined) return;

      this.staffUnitService.save(resultDialog.result).subscribe({
        next: resultModel => this.pageState.staffUnits.add(resultModel),
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
