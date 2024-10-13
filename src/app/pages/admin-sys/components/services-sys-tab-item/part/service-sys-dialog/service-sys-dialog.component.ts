import { AsyncPipe, JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, model, OnInit, signal, WritableSignal } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ServiceSysModel, UserModel } from 'app/models';
import { PageState } from 'app/pages/admin-sys/state/PageState';
import { IDialogServiceSysData, IDialogServiceSysResult } from './types';

@Component({
  selector: 'app-employee-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    MatChipsModule,
    AsyncPipe,
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    JsonPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './service-sys-dialog.component.html',
  styleUrl: './service-sys-dialog.component.scss'
})
export class ServiceSysDialogComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<ServiceSysDialogComponent, ServiceSysModel>);
  readonly data = inject<IDialogServiceSysData>(MAT_DIALOG_DATA);
  readonly modelDialogData = model(this.data);
  dialogResult?: IDialogServiceSysResult = undefined;

  pageState = inject(PageState);

  // form fields
  formControlServiceSysName = new FormControl<string | undefined>(undefined);
  formControlServiceSysDesc = new FormControl<string | undefined>(undefined);
  formControlUserOwner = new FormControl<UserModel[]>([]);
  formControlUserAdmin = new FormControl<UserModel[]>([]);

  // if errors are made when filling in the fields, these messages will be displayed
  fieldsErrorMessages = {
    serviceName: signal<string>(''),
    serviceDesc: signal<string>(''),
    usersOwner: signal<string>(''),
    usersAdmin: signal<string>(''),
  };

  // a user can only have one role, so if a user was selected with a role 
  // we will remove it from the array of possible users to select
  usersPossibleToSelect = signal(this.pageState.users.data());

  // ----------------------------------- for field of users owner -----------------------------------
  readonly currentUserOwnerUserName = model<string | undefined>(undefined);
  readonly selectedUsersOwner = signal<UserModel[]>([]);
  readonly filteredUsersOwner = computed(() => {
    const currentUserOwnerUserName = this.currentUserOwnerUserName()?.toLowerCase();
    return currentUserOwnerUserName
      ? this.usersPossibleToSelect().filter(user => user.userName.toLowerCase().includes(currentUserOwnerUserName))
      : this.usersPossibleToSelect().slice();
  });


  /**
   * Chip click event to delete an element
   * 
   * @param userOwner 
   */
  onRemoveUserOwner(userOwner: UserModel): void {
    this.removeUserFromSelectedList(this.selectedUsersOwner, userOwner);
  }


  /**
   * Event when has been selected option from list
   * 
   * @param event 
   */
  onSelectedUserOwner(event: MatAutocompleteSelectedEvent): void {
    this.currentUserOwnerUserName.set('');
    event.option.deselect();
    this.addUserToSelectedList(this.selectedUsersOwner, event.option.value);
  }


  /**
   * Event of click on button to clear field of users owner.
   * Reset possible users for selecting for this we will return the taken users.
   * Reset selected users.
   */
  onClickClearUsersOwner() {
    this.usersPossibleToSelect.set([...this.usersPossibleToSelect(), ...this.selectedUsersOwner()]);
    this.selectedUsersOwner.set([]);
  }
  // ----------------------------------- /for field of users owner -----------------------------------


  // ----------------------------------- for field of users admin -----------------------------------
  readonly currentUserAdminUserName = model<string | undefined>(undefined);
  readonly selectedUsersAdmin = signal<UserModel[]>([]);
  readonly filteredUsersAdmin = computed(() => {
    const currentUserAdminUserName = this.currentUserAdminUserName()?.toLowerCase();
    return currentUserAdminUserName
      ? this.usersPossibleToSelect().filter(user => user.userName.toLowerCase().includes(currentUserAdminUserName))
      : this.usersPossibleToSelect().slice();
  });

  /**
   * Chip click event to delete an element
   * 
   * @param userAdmin 
   */
  onRemoveUserAdmin(userAdmin: UserModel): void {
    this.removeUserFromSelectedList(this.selectedUsersAdmin, userAdmin);
  }


  /**
   * Event when has been selected option from list
   * 
   * @param event 
   */
  onSelectedUserAdmin(event: MatAutocompleteSelectedEvent): void {
    this.currentUserAdminUserName.set('');
    event.option.deselect();
    this.addUserToSelectedList(this.selectedUsersAdmin, event.option.value);
  }


  /**
   * Event of click on button to clear field of users owner.
   * Reset possible users for selecting for this we will return the taken users.
   * Reset selected users.
   */
  onClickClearUsersAdmin() {
    this.usersPossibleToSelect.set([...this.usersPossibleToSelect(), ...this.selectedUsersAdmin()]);
    this.selectedUsersAdmin.set([]);
  }
  // ----------------------------------- /for field of users admin -----------------------------------


  /**
   * Shared function to add user to selected list
   * 
   * @param selectedUsers pointer to WritableSignal<UserModel[]>, 
   * the value takes a list of users with a specific role (e.g. 'owner', 'admin', ...)
   * @param user user to add
   */
  private addUserToSelectedList(selectedUsers: WritableSignal<UserModel[]>, user: UserModel): void {
    selectedUsers.update(usersAdmin => [...usersAdmin, user]);
    this.usersPossibleToSelect.set([...this.usersPossibleToSelect().filter(userItem => userItem.userID != user.userID)]);
  }


  /**
 * Shared function to remove user from selected list
 * 
 * @param selectedUsers pointer to WritableSignal<UserModel[]>, 
 * the value takes a list of users with a specific role (e.g. 'owner', 'admin', ...)
 * @param user user to remove
 */
  private removeUserFromSelectedList(selectedUsers: WritableSignal<UserModel[]>, user: UserModel): void {
    selectedUsers.set([...selectedUsers().filter(userItem => userItem.userID !== user.userID)]);
    this.usersPossibleToSelect.set([...this.usersPossibleToSelect(), user]);
  }


  /**
   * Component has been initialized
   */
  ngOnInit() {
    // Set init value to fields service name and service desc
    this.formControlServiceSysName.setValue(this.modelDialogData().data.serviceName);
    this.formControlServiceSysDesc.setValue(this.modelDialogData().data.serviceDesc);

    // Set init value to field user owner
    this.modelDialogData().data.usersIdsAsRoleOwner.map(
      userId => this.addUserToSelectedList(
        this.selectedUsersOwner,
        (() => {
          const userFindedId = this.pageState.users.data().find(user => user.userID == userId);
          if (userFindedId == undefined) throw new Error('ServiceSysDialog: userFindedId is undefined');
          return userFindedId;
        })()
      )
    );

    // Set init value to field user admin
    this.modelDialogData().data.usersIdsAsRoleAdmin.map(
      userId => this.addUserToSelectedList(
        this.selectedUsersAdmin,
        (() => {
          const userFindedId = this.pageState.users.data().find(user => user.userID == userId);
          if (userFindedId == undefined) throw new Error('ServiceSysDialog: userFindedId is undefined');
          return userFindedId;
        })()
      )
    );
  }


  /**
   * Clicked button 'Ok' in dialog.
   */
  onClickOk(): void {
    if (this.validateFieldsAtDialog()) return;

    this.dialogResult = {
      result: {
        serviceId: this.modelDialogData().data.serviceId,
        serviceName: this.formControlServiceSysName.value ?? '',
        serviceDesc: this.formControlServiceSysDesc.value ?? '',
        usersIdsAsRoleUser: [],
        usersIdsAsRoleOwner: [...this.selectedUsersOwner()
          .map(userItem => userItem.userID)
          .filter(userItem => userItem != undefined)
        ],
        usersIdsAsRoleAdmin: [...this.selectedUsersAdmin()
          .map(userItem => userItem.userID)
          .filter(userItem => userItem != undefined)
        ]
      }
    };

    this.dialogRef.close(this.dialogResult);
  }


  /**
   * Clicked button 'Cancel' in dialog
   */
  onClickCancel(): void {
    this.dialogRef.close(this.dialogResult);
  }


  // @TODO It's better to rewrite through validators in form controls
  /**
   * Checking fields at dialog (e.g. field input must have value, ...)
   * 
   * @returns {boolean} if validation has error then return false, else return true
   */
  validateFieldsAtDialog(): boolean {
    let isValidationHasError = false;

    let fieldServiceNameErrors: string[] = [];
    let fieldServiceDescErrors: string[] = [];
    let fieldUsersOwnerErrors: string[] = [];
    let fieldUsersAdminErrors: string[] = [];

    // field: service name
    if (this.formControlServiceSysName.value == undefined ||
      this.formControlServiceSysName.value == ''
    ) {
      this.formControlServiceSysName.markAsDirty();
      this.formControlServiceSysName.markAsTouched();
      this.formControlServiceSysName.updateValueAndValidity();

      fieldServiceNameErrors.push('Поле не может быть пустым');
      isValidationHasError = true;
    }

    // field: service desc
    if (this.formControlServiceSysDesc.value == undefined ||
      this.formControlServiceSysDesc.value == ''
    ) {
      this.formControlServiceSysDesc.markAsDirty();
      this.formControlServiceSysDesc.markAsTouched();
      this.formControlServiceSysDesc.updateValueAndValidity();

      fieldServiceDescErrors.push('Поле не может быть пустым');
      isValidationHasError = true;
    }

    // @BUG not worked, form control not reacts to mark dirty
    // @LINK see example: "https://stackblitz.com/edit/angular-chip-with-autocomplete-and-validation?file=src%2Fapp%2Fapp.component.html,src%2Fapp%2Fapp.component.ts"
    // field: users owner
    /*
    if (this.selectedUsersOwner() == undefined ||
      this.selectedUsersOwner().length == 0
    ) {
      this.formControlUserOwner.markAsDirty();
      this.formControlUserOwner.markAsTouched();
      this.formControlUserOwner.updateValueAndValidity();

      fieldUsersOwnerErrors.push('Поле не может быть пустым');
      isValidationHasError = true;
    }
    */

    // @BUG not worked, form control not reacts to mark dirty
    // @LINK see example: "https://stackblitz.com/edit/angular-chip-with-autocomplete-and-validation?file=src%2Fapp%2Fapp.component.html,src%2Fapp%2Fapp.component.ts"
    // field: users admin
    /*
    if (this.formControlUserAdmin.value == undefined ||
      this.formControlUserAdmin.value.length == 0
    ) {
      this.formControlUserAdmin.markAsDirty();
      this.formControlUserAdmin.markAsTouched();
      this.formControlUserAdmin.updateValueAndValidity();

      fieldUsersAdminErrors.push('Поле не может быть пустым');
      isValidationHasError = true;
    }
    */

    this.fieldsErrorMessages.serviceName.set(fieldServiceNameErrors.join(', '));
    this.fieldsErrorMessages.serviceDesc.set(fieldServiceDescErrors.join(', '));
    this.fieldsErrorMessages.usersOwner.set(fieldUsersOwnerErrors.join(', '));
    this.fieldsErrorMessages.usersAdmin.set(fieldUsersAdminErrors.join(', '));

    return isValidationHasError;
  }


  /**
   * Get fullname of employee by assotiated with him user
   * 
   * @param {UserModel} user 
   * @returns {string | undefined} Full name of employee
   */
  getEmployeeFullNameByUser(user: UserModel): string | undefined {
    return this.pageState.employees.data().find(employee => employee.employeeID === user.employeeID)?.fullName;
  }
}
