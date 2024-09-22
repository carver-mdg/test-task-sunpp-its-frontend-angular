import { Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DepartmentModel } from 'app/models';
import { IDialogDepartmentData, IDialogDepartmentResult } from './types';

@Component({
  selector: 'app-department-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './department-dialog.component.html',
  styleUrl: './department-dialog.component.scss'
})
export class DepartmentDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DepartmentDialogComponent, DepartmentModel>);
  readonly data = inject<IDialogDepartmentData>(MAT_DIALOG_DATA);
  readonly department = model(this.data);
  dialogResult?: IDialogDepartmentResult = undefined;

  dialogCheckingFieldResult = {
    isErrgAtFieldName: signal(false),
    errMsgAtFieldName: signal(''),
  };


  /**
   * Clicked button 'Ok' in dialog.
   */
  onClickOk(): void {
    if (this.validateFieldsAtDialog()) return;

    this.dialogResult = {
      result: {
        departmentID: this.department().department.departmentID,
        departmentName: this.department().department?.departmentName
      }
    };
    this.dialogRef.close(this.dialogResult);
  }


  /**
   * Clicked button 'Cancel' in dialog
   */
  onClickCancel(): void {
    this.dialogRef.close();
  }


  /**
   * Checking fields at dialog (e.g. field input must have value, ...)
   * 
   * @returns {boolean} if validation has error then return false, else return true
   */
  validateFieldsAtDialog(): boolean {
    let isValidationHasError = false;

    if (this.department().department?.departmentName == '' ||
      this.department().department?.departmentName == undefined
    ) {
      this.dialogCheckingFieldResult.isErrgAtFieldName.set(true);
      this.dialogCheckingFieldResult.errMsgAtFieldName.set('Поле не может быть пустым');
      isValidationHasError = true;
    }

    return isValidationHasError;
  }
}
