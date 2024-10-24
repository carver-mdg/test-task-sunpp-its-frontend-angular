import { AsyncPipe } from '@angular/common';
import { Component, inject, model, OnInit, signal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { UserRoleInServiceModel } from 'app/models';
import { IDialogRequestUserRoleData, IDialogRequestUserRoleResult } from './types';
import { map, Observable, startWith } from 'rxjs';

@Component({
  selector: 'app-dialog-request-user-role',
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
  ],
  templateUrl: './dialog-request-user-role.component.html',
  styleUrl: './dialog-request-user-role.component.scss'
})
export class DialogRequestUserRoleComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DialogRequestUserRoleComponent, UserRoleInServiceModel>);
  readonly data = inject<IDialogRequestUserRoleData>(MAT_DIALOG_DATA);
  readonly modelDialogData = model(this.data);
  dialogResult?: IDialogRequestUserRoleResult = undefined;

  filteredOptionsOfUserRoles?: Observable<UserRoleInServiceModel[]>;

  // form fields
  formControlUserRole = new FormControl<UserRoleInServiceModel | undefined>(undefined);

  // if errors are made when filling in the fields, these messages will be displayed
  fieldsErrorMessages = {
    userRoleName: signal<string>(''),
  };


  /**
   * Component has been initialized
   */
  ngOnInit() {
    this.filteredOptionsOfUserRoles = this.formControlUserRole.valueChanges.pipe(
      startWith(''),
      map(userRole => {
        const userRoleName = typeof userRole === 'string' ? userRole : userRole?.roleName;
        return userRoleName ? this.onFilterUserRoles(userRoleName as string) : this.modelDialogData().data.slice();
      }),
    );

    // Set init value to field user role
    this.formControlUserRole.setValue(undefined);
  }


  /**
   * Display value in autocomplete input field after selected it
   * 
   * @param userRole 
   * @returns name of user role type
   */
  displayFnUserRole(userRole: UserRoleInServiceModel): string {
    return userRole && userRole.roleName ? userRole.roleName : '';
  }


  /**
   * This function is called when the value in the input form changes.
   * 
   * @param userRoleName 
   * @returns filtered staff units models by value in the input form by it staff unit names
   */
  private onFilterUserRoles(userRoleName: string): UserRoleInServiceModel[] {
    const filterValue = userRoleName.toLowerCase();

    return this.modelDialogData().data.filter(option => option.roleName && option.roleName.toLowerCase().includes(filterValue));
  }


  /**
   * Clicked button 'Ok' in dialog.
   */
  onClickOk(): void {
    if (this.validateFieldsAtDialog()) return;

    this.dialogResult = {
      result: {
        roleId: this.formControlUserRole.value?.roleId,
        roleName: this.formControlUserRole.value?.roleName,
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

    let fieldUserRoleErrors: string[] = [];

    // field: staff unit
    if (this.formControlUserRole.value == undefined ||
      this.formControlUserRole.value.roleName == ''
    ) {
      this.formControlUserRole.markAsDirty();
      this.formControlUserRole.markAsTouched();
      this.formControlUserRole.updateValueAndValidity();

      fieldUserRoleErrors.push('Поле не может быть пустым');
      isValidationHasError = true;
    }

    this.fieldsErrorMessages.userRoleName.set(fieldUserRoleErrors.join(', '));

    return isValidationHasError;
  }
}
