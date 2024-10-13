import { AsyncPipe, JsonPipe } from '@angular/common';
import { Component, inject, model, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { DepartmentModel, StaffUnitModel } from 'app/models';
import { DepartmentsState } from 'app/pages/admin-sys/state/items/departments';
import { map, Observable, startWith } from 'rxjs';
import { IDialogStaffUnitData, IDialogStaffUnitResult } from './types';

@Component({
  selector: 'app-staff-unit-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    AsyncPipe,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    JsonPipe,
  ],
  templateUrl: './staff-unit-dialog.component.html',
  styleUrl: './staff-unit-dialog.component.scss'
})
export class StaffUnitDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<StaffUnitDialogComponent, StaffUnitModel>);
  readonly data = inject<IDialogStaffUnitData>(MAT_DIALOG_DATA);
  readonly modelDialogData = model(this.data);
  dialogResult?: IDialogStaffUnitResult = undefined;

  departments = inject(DepartmentsState);
  filteredOptionsOfDepartments?: Observable<DepartmentModel[]>;

  // form fields
  formControlStaffUnit = new FormControl<string | undefined>(undefined);
  formControlDepartment = new FormControl<DepartmentModel | undefined>(undefined);

  // if errors are made when filling in the fields, these messages will be displayed
  fieldsErrorMessages = {
    staffUnitName: signal<string>(''),
    departmentName: signal<string>(''),
  };


  /**
   * Component has been initialized
   */
  ngOnInit() {
    this.filteredOptionsOfDepartments = this.formControlDepartment.valueChanges.pipe(
      startWith(''),
      map(department => {
        const departmentName = typeof department === 'string' ? department : department?.departmentName;
        return departmentName ? this.onFilterDepartments(departmentName as string) : this.departments.data().slice();
      }),
    );

    // Set init value to field staffUnitName
    this.formControlStaffUnit.setValue(this.modelDialogData().data.staffUnitName);

    // Set init value to field department
    this.formControlDepartment.setValue(
      this.departments.data().find(
        item => item.departmentID == this.modelDialogData().data.departmentID
      )
    );
  }


  /**
   * Display value in autocomplete input field after selected it
   * 
   * @param department 
   * @returns name of department
   */
  displayFnDepartment(department: DepartmentModel): string {
    return department && department.departmentName ? department.departmentName : '';
  }


  /**
   * This function is called when the value in the input form changes.
   * 
   * @param departmentName 
   * @returns filtered department models by value in the input form by it department names
   */
  private onFilterDepartments(departmentName: string): DepartmentModel[] {
    const filterValue = departmentName.toLowerCase();

    return this.departments.data().filter(option => option.departmentName.toLowerCase().includes(filterValue));
  }


  /**
   * Clicked button 'Ok' in dialog.
   */
  onClickOk(): void {
    if (this.validateFieldsAtDialog()) return;

    this.dialogResult = {
      result: {
        staffUnitID: this.modelDialogData().data.staffUnitID,
        staffUnitName: this.formControlStaffUnit.value ?? '',
        departmentID: this.formControlDepartment.value?.departmentID,
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
    let fieldDepartmentErrors: string[] = [];

    // field: StaffUnitName
    if (this.formControlStaffUnit.value == undefined ||
      this.formControlStaffUnit.value == ''
    ) {
      this.formControlStaffUnit.markAsDirty();
      this.formControlStaffUnit.markAsTouched();
      this.formControlStaffUnit.updateValueAndValidity();

      fieldNameErrors.push('Поле не может быть пустым');
      isValidationHasError = true;
    }

    // field: department
    if (this.formControlDepartment.value == undefined ||
      this.formControlDepartment.value.departmentName == ''
    ) {
      this.formControlDepartment.markAsDirty();
      this.formControlDepartment.markAsTouched();
      this.formControlDepartment.updateValueAndValidity();

      fieldDepartmentErrors.push('Поле не может быть пустым');
      isValidationHasError = true;
    }

    this.fieldsErrorMessages.staffUnitName.set(fieldNameErrors.join(', '));
    this.fieldsErrorMessages.departmentName.set(fieldDepartmentErrors.join(', '));

    return isValidationHasError;
  }
}
