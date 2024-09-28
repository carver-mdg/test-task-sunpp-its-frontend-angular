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
import { UserModel, EmployeeModel } from 'app/models';
import { PageState } from 'app/pages/admin-sys/state/PageState';
import { map, Observable, startWith } from 'rxjs';
import { IDialogUserData, IDialogUserResult } from './types';

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
  templateUrl: './user-dialog.component.html',
  styleUrl: './user-dialog.component.scss'
})
export class UserDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<UserDialogComponent, UserModel>);
  readonly data = inject<IDialogUserData>(MAT_DIALOG_DATA);
  readonly user = model(this.data);

  pageState = inject(PageState);
  filteredOptionsOfEmployees?: Observable<EmployeeModel[]>;

  dialogResult?: IDialogUserResult = undefined;

  // form fields
  formControlUserLogin = new FormControl<string | undefined>(undefined);
  formControlUserPassword = new FormControl<string | undefined>(undefined);
  formControlEmployee = new FormControl<EmployeeModel | undefined>(undefined);

  // if errors are made when filling in the fields, these messages will be displayed
  fieldsErrorMessages = {
    userLogin: signal<string>(''),
    userPassword: signal<string>(''),
    employeeName: signal<string>(''),
  };


  /**
   * Component has been initialized
   */
  ngOnInit() {
    this.filteredOptionsOfEmployees = this.formControlEmployee.valueChanges.pipe(
      startWith(''),
      map(employee => {
        const employeeFullName = typeof employee === 'string' ? employee : employee?.fullName;
        return employeeFullName ? this.onFilterEmployees(employeeFullName as string) : this.pageState.employees.data().slice();
      }),
    );

    // Set init value to field user.fullName
    this.formControlUserLogin.setValue(this.user().user.login);

    // Set init value to field employee
    this.formControlEmployee.setValue(
      this.pageState.employees.data().find(
        item => item.employeeID == this.user().user.employeeID
      )
    );
  }


  /**
   * Display value in autocomplete input field after selected it
   * 
   * @param employee 
   * @returns name of employee
   */
  displayFnEmployee(employee: EmployeeModel): string {
    return employee && employee.fullName ? employee.fullName : '';
  }


  /**
   * This function is called when the value in the input form changes.
   * 
   * @param employeeFullName 
   * @returns filtered employees models by value in the input form by it employee names
   */
  private onFilterEmployees(employeeFullName: string): EmployeeModel[] {
    const filterValue = employeeFullName.toLowerCase();

    return this.pageState.employees.data().filter(option => option.fullName.toLowerCase().includes(filterValue));
  }


  /**
   * Clicked button 'Ok' in dialog.
   */
  onClickOk(): void {
    if (this.validateFieldsAtDialog()) return;

    this.dialogResult = {
      result: {
        userID: this.user().user.userID,
        login: this.formControlUserLogin.value ?? '',
        employeeID: this.formControlEmployee.value?.employeeID,
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

    let fieldLoginErrors: string[] = [];
    let fieldPasswordErrors: string[] = [];
    let fieldEmployeeErrors: string[] = [];

    // field: user login
    if (this.formControlUserLogin.value == undefined ||
      this.formControlUserLogin.value == ''
    ) {
      this.formControlUserLogin.markAsDirty();
      this.formControlUserLogin.markAsTouched();
      this.formControlUserLogin.updateValueAndValidity();

      fieldLoginErrors.push('Поле не может быть пустым');
      isValidationHasError = true;
    }

    // field: user password
    if (this.formControlUserPassword.value == undefined ||
      this.formControlUserPassword.value == ''
    ) {
      this.formControlUserPassword.markAsDirty();
      this.formControlUserPassword.markAsTouched();
      this.formControlUserPassword.updateValueAndValidity();

      fieldPasswordErrors.push('Поле не может быть пустым');
      isValidationHasError = true;
    }

    // field: employee
    if (this.formControlEmployee.value == undefined ||
      this.formControlEmployee.value.fullName == ''
    ) {
      this.formControlEmployee.markAsDirty();
      this.formControlEmployee.markAsTouched();
      this.formControlEmployee.updateValueAndValidity();

      fieldEmployeeErrors.push('Поле не может быть пустым');
      isValidationHasError = true;
    }

    this.fieldsErrorMessages.userLogin.set(fieldLoginErrors.join(', '));
    this.fieldsErrorMessages.userPassword.set(fieldPasswordErrors.join(', '));
    this.fieldsErrorMessages.employeeName.set(fieldEmployeeErrors.join(', '));

    return isValidationHasError;
  }
}