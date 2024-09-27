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
import { EmployeeModel, StaffUnitModel } from 'app/models';
import { PageState } from 'app/pages/admin-sys/state/PageState';
import { map, Observable, startWith } from 'rxjs';
import { IDialogEmployeeData, IDialogEmployeeResult } from './types';

@Component({
  selector: 'app-employee-dialog',
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
  templateUrl: './employee-dialog.component.html',
  styleUrl: './employee-dialog.component.scss'
})
export class EmployeeDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<EmployeeDialogComponent, EmployeeModel>);
  readonly data = inject<IDialogEmployeeData>(MAT_DIALOG_DATA);
  readonly employee = model(this.data);

  pageState = inject(PageState);
  filteredOptionsOfStaffUnits?: Observable<StaffUnitModel[]>;

  dialogResult?: IDialogEmployeeResult = undefined;

  // form fields
  formControlEmployeeFullName = new FormControl<string | undefined>(undefined);
  formControlStaffUnit = new FormControl<StaffUnitModel | undefined>(undefined);

  // if errors are made when filling in the fields, these messages will be displayed
  fieldsErrorMessages = {
    employeeFullName: signal<string>(''),
    staffUnitName: signal<string>(''),
  };


  /**
   * Component has been initialized
   */
  ngOnInit() {
    this.filteredOptionsOfStaffUnits = this.formControlStaffUnit.valueChanges.pipe(
      startWith(''),
      map(staffUnit => {
        const staffUnitName = typeof staffUnit === 'string' ? staffUnit : staffUnit?.staffUnitName;
        return staffUnitName ? this.onFilterStaffUnits(staffUnitName as string) : this.pageState.staffUnits.data().slice();
      }),
    );

    // Set init value to field employee.fullName
    this.formControlEmployeeFullName.setValue(this.employee().employee.fullName);

    // Set init value to field staff unit
    this.formControlStaffUnit.setValue(
      this.pageState.staffUnits.data().find(
        item => item.staffUnitID == this.employee().employee.staffUnitID
      )
    );
  }


  /**
   * Display value in autocomplete input field after selected it
   * 
   * @param staffUnit 
   * @returns name of staff unit
   */
  displayFnStaffUnit(staffUnit: StaffUnitModel): string {
    return staffUnit && staffUnit.staffUnitName ? staffUnit.staffUnitName : '';
  }


  /**
   * This function is called when the value in the input form changes.
   * 
   * @param staffUnitName 
   * @returns filtered staff units models by value in the input form by it staff unit names
   */
  private onFilterStaffUnits(staffUnitName: string): StaffUnitModel[] {
    const filterValue = staffUnitName.toLowerCase();

    return this.pageState.staffUnits.data().filter(option => option.staffUnitName.toLowerCase().includes(filterValue));
  }


  /**
   * Clicked button 'Ok' in dialog.
   */
  onClickOk(): void {
    if (this.validateFieldsAtDialog()) return;

    this.dialogResult = {
      result: {
        employeeID: this.employee().employee.employeeID,
        fullName: this.formControlEmployeeFullName.value ?? '',
        staffUnitID: this.formControlStaffUnit.value?.staffUnitID,
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

    let fieldNameErrors: string[] = [];
    let fieldStaffUnitErrors: string[] = [];

    // field: employee full name
    if (this.formControlEmployeeFullName.value == undefined ||
      this.formControlEmployeeFullName.value == ''
    ) {
      this.formControlEmployeeFullName.markAsDirty();
      this.formControlEmployeeFullName.markAsTouched();
      this.formControlEmployeeFullName.updateValueAndValidity();

      fieldNameErrors.push('Поле не может быть пустым');
      isValidationHasError = true;
    }

    // field: staff unit
    if (this.formControlStaffUnit.value == undefined ||
      this.formControlStaffUnit.value.staffUnitName == ''
    ) {
      this.formControlStaffUnit.markAsDirty();
      this.formControlStaffUnit.markAsTouched();
      this.formControlStaffUnit.updateValueAndValidity();

      fieldStaffUnitErrors.push('Поле не может быть пустым');
      isValidationHasError = true;
    }

    this.fieldsErrorMessages.employeeFullName.set(fieldNameErrors.join(', '));
    this.fieldsErrorMessages.staffUnitName.set(fieldStaffUnitErrors.join(', '));

    return isValidationHasError;
  }


  /**
  * Get department name of staff unit
  * 
  * @param staffUnit 
  * @returns 
  */
  getDepartmentNameByStaffUnit(staffUnit: StaffUnitModel) {
    return this.pageState.departments.data().find(
      departmentItem => departmentItem.departmentID == staffUnit.departmentID
    )?.departmentName;
  }
}
