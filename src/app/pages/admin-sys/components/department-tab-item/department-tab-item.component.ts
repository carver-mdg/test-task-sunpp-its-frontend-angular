import { DialogModule } from '@angular/cdk/dialog';
import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { DepartmentDialogComponent } from './part/department-dialog/department-dialog.component';
import { IDialogDepartmentData } from './part/department-dialog/types/IDialogDepartmentData';
import { PageState, StateLoadingItem } from '../../PageState';
import { DepartmentService } from '../../services/department.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { IDialogDepartmentResult } from './part/department-dialog/types';
import { DepartmentListComponent } from './part/department-list/department-list.component';

@Component({
  selector: 'app-department-tab-item',
  standalone: true,
  imports: [
    AsyncPipe,
    MatTabsModule, MatTableModule, MatButtonModule, MatIconModule, FormsModule, DialogModule,
    MatFormFieldModule, MatInputModule, DepartmentListComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './department-tab-item.component.html',
  styleUrl: './department-tab-item.component.scss'
})
export class DepartmentTabItemComponent {
  /**
   * 
   */
  constructor(
    private departmentService: DepartmentService,
    private pageState: PageState,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) { }


  /**
   * Open dialog for create new department.
   * After close of dialog call event with data to update component model.
   */
  public openDialogCreateDepartment(): void {
    const dialogRef: MatDialogRef<DepartmentDialogComponent, IDialogDepartmentResult>
      = this.dialog.open<DepartmentDialogComponent, IDialogDepartmentData, IDialogDepartmentResult>(DepartmentDialogComponent, {
        data: {
          dialogType: 'create',
          department: { departmentID: undefined, departmentName: '' },
        },
      });

    dialogRef.afterClosed().subscribe(resultDialog => {
      if (resultDialog == undefined) return;

      this.departmentService.saveDepartment(resultDialog.result).subscribe({
        next: resultModel => this.pageState.addDepartment(resultModel),
        error: (error) => this.showError(error),
      });
    });
  }

  /**
   * Show error
   * 
   * @param error 
   */
  private showError(error: any) {
    let errMessage: string | undefined = undefined;
    if (error instanceof HttpErrorResponse)
      errMessage = error.message;
    else
      errMessage = error;

    this.snackBar.open(errMessage?.toString() ?? 'unknown error', 'Ok', {
      duration: 3000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['snackbar-error'],
    });
  }

  /**
   * Click on button emulate error loading data
   */
  public onEmulateLoadError() {
    this.pageState.loadingState.set({ departments: StateLoadingItem.loading() });

    this.departmentService.emulateLoadError().subscribe({
      next: () => this.pageState.createDepartments([]),
      error: (err) => this.pageState.loadingState.set({ departments: StateLoadingItem.error(err) }),
      complete: () => this.pageState.loadingState.set({ departments: StateLoadingItem.complete() })
    });
  }

  /**
   * Click on button emulate slow loading data
   */
  public onEmulateLoadSlow() {
    this.pageState.loadingState.set({ departments: StateLoadingItem.loading() });

    this.departmentService.emulateLoadSlow().subscribe({
      next: departments => this.pageState.createDepartments(departments),
      error: (err) => this.pageState.loadingState.set({ departments: StateLoadingItem.error(err) }),
      complete: () => this.pageState.loadingState.set({ departments: StateLoadingItem.complete() })
    });
  }
}
