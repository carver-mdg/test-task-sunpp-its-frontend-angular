import { DialogModule } from '@angular/cdk/dialog';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
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
import { DepartmentDialogComponent } from './part/department-dialog/department-dialog.component';
import { IDialogDepartmentData } from './part/department-dialog/types/IDialogDepartmentData';

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
  constructor() { }


  /**
   * Open dialog for create new department.
   * After close of dialog call event with data to update component model.
   */
  openDialogCreateDepartment(): void {
    const dialogRef: MatDialogRef<DepartmentDialogComponent, DepartmentModel>
      = this.dialog.open<DepartmentDialogComponent, IDialogDepartmentData, DepartmentModel>(DepartmentDialogComponent, {
        data: {
          dialogType: 'create',
          department: { departmentID: undefined, departmentName: '' },
        },
      });

    dialogRef.afterClosed().subscribe(resultDialog => {
      if (resultDialog == undefined) return;

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
  }

  /**
   * 
   * @param department 
   */
  onDeleteDepartment(department: DepartmentModel) {
    this.deleteDepartmentEvent.emit(department);
  }

}
