import { DialogModule } from '@angular/cdk/dialog';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, ErrorHandler, EventEmitter, inject, Input, OnChanges, OnInit, Output, signal, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { DepartmentListComponent } from './part/department-list/department-list.component';
import { DepartmentModel } from 'app/models';
import { AppServiceService } from 'app/pages/admin-sys/services/app.service.service';
import { DepartmentDialogComponent } from './part/department-dialog/department-dialog.component';
import { IDepartmentDialogData } from './part/department-dialog/types/IDepartmentDialogData';
import { DialogConfirmComponent } from 'app/components/dialog-confirm/dialog-confirm.component';
import { IDialogDataConfirm } from 'app/components/dialog-confirm/types/IDialogDataConfirm';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-department-tab-item',
  standalone: true,
  imports: [
    DepartmentListComponent, AsyncPipe,
    MatTabsModule, MatTableModule, MatButtonModule, MatIconModule, FormsModule, DialogModule,
    MatFormFieldModule, MatInputModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './department-tab-item.component.html',
  styleUrl: './department-tab-item.component.scss'
})
export class DepartmentTabItemComponent {
  @Input() departments: DepartmentModel[] = [];
  @Output() createDepartmentEvent = new EventEmitter<DepartmentModel>();
  @Output() updateDepartmentEvent = new EventEmitter<DepartmentModel>();
  @Output() deleteDepartmentEvent = new EventEmitter<DepartmentModel>();
  readonly dialog = inject(MatDialog);

  /**
   * 
   */
  constructor(private appService: AppServiceService) { }


  /**
   * Open dialog for create new department.
   * After close of dialog call event with data to update component model.
   */
  openDialogCreateDepartment(): void {
    const dialogRef: MatDialogRef<DepartmentDialogComponent, IDepartmentDialogData>
      = this.dialog.open<DepartmentDialogComponent, IDepartmentDialogData>(DepartmentDialogComponent, {
        data: { dialogType: 'create', departmentID: undefined, departmentName: undefined },
      });

    dialogRef.afterClosed().subscribe(resultDialog => {
      if (resultDialog == undefined || resultDialog.departmentName == undefined) return;

      this.createDepartmentEvent.emit({
        departmentID: resultDialog.departmentID,
        departmentName: resultDialog.departmentName,
      });
    });
  }

  /**
   * 
   * @param department 
   */
  onEditDepartment(department: DepartmentModel) {
    this.updateDepartmentEvent.emit(department);

    // const dialogRef: MatDialogRef<DepartmentDialogComponent, IDepartmentDialogData>
    //   = this.dialog.open<DepartmentDialogComponent, IDepartmentDialogData>(DepartmentDialogComponent, {
    //     data: { dialogType: 'update', departmentID: department.departmentID, departmentName: department.departmentName },
    //   });

    // dialogRef.afterClosed().subscribe(resultDialog => {
    //   if (resultDialog == undefined || resultDialog.departmentName == undefined) return;

    //   this.appService.updateDepartment({
    //     departmentID: resultDialog.departmentID,
    //     departmentName: resultDialog.departmentName
    //   }).subscribe(data => {
    //     console.log(data);
    //     this.departments.set([...this.departments().map(item => {
    //       if (item.departmentID == data.departmentID) {
    //         return { departmentID: data.departmentID, departmentName: data.departmentName }
    //       }
    //       return item;
    //     })]);
    //   });
    // });
  }

  /**
   * 
   * @param department 
   */
  onDeleteDepartment(department: DepartmentModel) {
    this.deleteDepartmentEvent.emit(department);

    // if (department == undefined)
    //   return;

    // const dialogRef = this.dialog.open<DialogConfirmComponent, IDialogDataConfirm>(DialogConfirmComponent, {
    //   data: {
    //     dialogTitle: 'Удалить запись',
    //     dialogContent: 'Вы хотите удалить запись ?',
    //     dialogBtnYesTitle: 'Удалить',
    //     dialogBtnNoTitle: 'Отмена'
    //   },
    // });

    // dialogRef.afterClosed().subscribe(resultDialog => {
    //   if (department.departmentID == undefined) return;
    //   if (resultDialog)
    //     this.deleteDepartmentEvent.emit(department);

      /*
      if (department.departmentID == undefined) return;
      if (resultDialog)
        this.appService.deleteDepartment(department.departmentID).subscribe(data =>
          this.departments.set([...this.departments().filter(item =>
            item.departmentID != data.departmentID
          )])
        );
        */
    // });
  }

}
