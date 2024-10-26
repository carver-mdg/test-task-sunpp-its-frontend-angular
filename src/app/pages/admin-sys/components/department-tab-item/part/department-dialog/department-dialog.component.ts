import { Component, inject, model, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
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
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './department-dialog.component.html',
  styleUrl: './department-dialog.component.scss'
})
export class DepartmentDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DepartmentDialogComponent, DepartmentModel>);
  readonly data = inject<IDialogDepartmentData>(MAT_DIALOG_DATA);
  readonly modelDialogData = model(this.data);
  dialogResult?: IDialogDepartmentResult = undefined;

  // form fields
  formControlDepartmentName = new FormControl<string | undefined>(undefined);

  // if errors are made when filling in the fields, these messages will be displayed
  fieldsErrorMessages = {
    departmentName: signal<string>(''),
  };


  /**
 * Component has been initialized
 */
  ngOnInit() {
    // Set init value to field departmentName
    this.formControlDepartmentName.setValue(this.modelDialogData().data.departmentName);
  }

  
  /**
   * Clicked button 'Ok' in dialog.
   */
  onClickOk(): void {
    if (this.validateFieldsAtDialog()) return;

    let departmentName = this.formControlDepartmentName.value;
    if(departmentName == undefined || departmentName == '') return;

    this.dialogResult = {
      result: {
        departmentId: this.modelDialogData().data.departmentId,
        departmentName: departmentName
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


  // @TODO It's better to rewrite through validators in form controls
  /**
   * Checking fields at dialog (e.g. field input must have value, ...)
   * 
   * @returns {boolean} if validation has error then return false, else return true
   */
  validateFieldsAtDialog(): boolean {
    let isValidationHasError = false;

    let fieldNameErrors: string[] = [];

    // field: departmentName
    if (this.formControlDepartmentName.value == undefined ||
      this.formControlDepartmentName.value == ''
    ) {
      this.formControlDepartmentName.markAsDirty();
      this.formControlDepartmentName.markAsTouched();
      this.formControlDepartmentName.updateValueAndValidity();

      fieldNameErrors.push('Поле не может быть пустым');
      isValidationHasError = true;
    }

    this.fieldsErrorMessages.departmentName.set(fieldNameErrors.join(', '));

    return isValidationHasError;
  }
}
