import { Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IDepartmentDialogData } from './types/IDepartmentDialogData';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { AppServiceService } from 'app/pages/admin-sys/services/app.service.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateDepartmentRequestDTO, UpdateDepartmentRequestDTO } from 'app/pages/admin-sys/dto';

@Component({
  selector: 'app-department-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDividerModule,
    MatIconModule
  ],
  templateUrl: './department-dialog.component.html',
  styleUrl: './department-dialog.component.scss'
})
export class DepartmentDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DepartmentDialogComponent>);
  readonly data = inject<IDepartmentDialogData>(MAT_DIALOG_DATA);
  readonly department = model(this.data);

  dialogCheckingFieldResult = {
    isErrgAtFieldName: signal(false),
    errMsgAtFieldName: signal(''),
  };

  /**
   * 
   */
  constructor(private appService: AppServiceService, private readonly snackBar: MatSnackBar) { }


  /**
   * Clicked button 'Ok' in dialog.
   * 
   * After clicking, the function calls the service methods and 
   * returns the results from it as a response from the dialog.
   * If you receive an error, the dialog will remain open.
   */
  onClickOk(): void {
    if (this.validateFieldsAtDialog()) return;

    let departmentName = this.department().departmentName;
    if (departmentName == undefined) return;

    switch (this.data.dialogType) {
      case 'create':
        this.appService.addDepartment({departmentName}).subscribe({
          next: resultModel => this.dialogRef.close(resultModel),
          error: err => this.parseErrorsFromServer(err)
        });
        break;

      case 'update':
        let departmentID = this.department().departmentID;
        if (departmentID == undefined) throw new Error('departmentID is undefined');

        this.appService.updateDepartment({departmentName, departmentID}).subscribe({
          next: resultModel => this.dialogRef.close(resultModel),
          error: err => this.parseErrorsFromServer(err)
        });
        break;
    }
  }

  /**
   * Clicked button 'Cancel' in dialog
   */
  onClickCancel(): void {
    this.dialogRef.close();
  }

  /**
   * If fields has been filled with errors than server responses array of errors.
   * Let's try to parse it.
   */
  parseErrorsFromServer(error: unknown): void {
    if (error instanceof HttpErrorResponse)
      switch (error.status) {
        case 422:
          this.snackBar.open(error.message, '', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: []
          });
          break;

        default:
          this.snackBar.open('Ошибка передачи данных', '', {
            duration: 3000,
            verticalPosition: 'top',
            panelClass: []
          });
      }
  }

  /**
   * Checking fields at dialog (e.g. field input must have value, ...)
   * 
   * @returns {boolean} if validation has error then return false, else return true
   */
  validateFieldsAtDialog(): boolean {
    let isValidationHasError = false;

    if (this.department().departmentName == '' || this.department().departmentName == undefined) {
      this.dialogCheckingFieldResult.isErrgAtFieldName.set(true);
      this.dialogCheckingFieldResult.errMsgAtFieldName.set('Поле не может быть пустым');
      isValidationHasError = true;
    }

    return isValidationHasError;
  }
}
