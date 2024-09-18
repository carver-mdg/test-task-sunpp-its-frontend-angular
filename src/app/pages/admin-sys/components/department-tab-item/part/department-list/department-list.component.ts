import { AsyncPipe } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { DepartmentModel } from 'app/models';
import { AppServiceService } from 'app/pages/admin-sys/services/app.service.service';
import { DepartmentDialogComponent } from '../department-dialog/department-dialog.component';
import { IDepartmentDialogData } from '../department-dialog/types/IDepartmentDialogData';
import { DialogConfirmComponent } from 'app/components/dialog-confirm/dialog-confirm.component';
import { IDialogDataConfirm } from 'app/components/dialog-confirm/types';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [AsyncPipe, MatTabsModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './department-list.component.html',
  styleUrl: './department-list.component.scss'
})
export class DepartmentListComponent {
  @Input() departments: DepartmentModel[] = [];
  @Output() editDepartmentEvent = new EventEmitter<DepartmentModel>();
  @Output() deleteDepartmentEvent = new EventEmitter<DepartmentModel>();
  displayedColumns: string[] = ['departmentID', 'departmentName', 'actions'];
  readonly dialog = inject(MatDialog);


  /**
   * 
   */
  constructor(private appService: AppServiceService, private readonly snackBar: MatSnackBar) { }


  /**
   * 
   * @param department 
   */
  onEditDepartment(department: DepartmentModel) {
    const dialogRef: MatDialogRef<DepartmentDialogComponent, IDepartmentDialogData>
      = this.dialog.open<DepartmentDialogComponent, IDepartmentDialogData>(DepartmentDialogComponent, {
        data: { dialogType: 'update', departmentID: department.departmentID, departmentName: department.departmentName },
      });

    dialogRef.afterClosed().subscribe(resultDialog => {
      if (resultDialog == undefined || resultDialog.departmentName == undefined) return;

      this.editDepartmentEvent.emit({
        departmentID: resultDialog.departmentID,
        departmentName: resultDialog.departmentName,
      });
    });
  }

  /**
   * 
   * @param department 
   */
  onDeleteDepartment(department: DepartmentModel) {
    const dialogRef = this.dialog.open<DialogConfirmComponent, IDialogDataConfirm>(DialogConfirmComponent, {
      data: {
        dialogTitle: 'Удалить запись',
        dialogContent: 'Вы хотите удалить запись ?',
        dialogBtnYesTitle: 'Удалить',
        dialogBtnNoTitle: 'Отмена'
      },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && department.departmentID != undefined) {

        this.appService.deleteDepartment(department.departmentID).subscribe({
          next: () => this.deleteDepartmentEvent.emit(department),
          error: (error) => {
            if (error instanceof HttpErrorResponse)
              this.snackBar.open(error.message, '', {
                duration: 3000,
                verticalPosition: 'top',
                panelClass: []
              });
          }
        });
      }
    });
  }

}
