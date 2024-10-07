import { DialogModule } from '@angular/cdk/dialog';
import { AsyncPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { ServiceSysService } from '../../services';
import { PageState } from '../../state/PageState';
import { ServiceSysDialogComponent } from './part/service-sys-dialog/service-sys-dialog.component';
import { IDialogServiceSysData, IDialogServiceSysResult } from './part/service-sys-dialog/types';
import { ServiceSysListComponent } from './part/service-sys-list/service-sys-list.component';

@Component({
  selector: 'app-service-sys-tab-item',
  standalone: true,
  imports: [
    AsyncPipe,
    MatTabsModule, MatTableModule, MatButtonModule, MatIconModule, FormsModule, DialogModule,
    MatFormFieldModule, MatInputModule, ServiceSysListComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './service-sys-tab-item.component.html',
  styleUrl: './service-sys-tab-item.component.scss'
})
export class ServiceSysTabItemComponent {
  /**
     * 
     */
  constructor(
    private serviceSysService: ServiceSysService,
    private pageState: PageState,
    private readonly snackBar: MatSnackBar,
    private readonly dialog: MatDialog,
  ) { }


  /**
   * Open dialog for create new system service
   */
  public openDialogCreateServiceSys(): void {
    const dialogRef: MatDialogRef<ServiceSysDialogComponent, IDialogServiceSysResult>
      = this.dialog.open<ServiceSysDialogComponent, IDialogServiceSysData, IDialogServiceSysResult>(ServiceSysDialogComponent, {
        data: {
          dialogType: 'create',
          serviceSys: { 
            serviceId: undefined, 
            serviceName: '', 
            serviceDesc: '', 
            usersIdsAsRoleUser: [],
            usersIdsAsRoleOwner: [], 
            usersIdsAsRoleAdmin: [] 
          },
        },
      });

    dialogRef.afterClosed().subscribe(resultDialog => {
      if (resultDialog == undefined) return;

      this.serviceSysService.save(resultDialog.result).subscribe({
        next: resultModel => this.pageState.servicesSys.add(resultModel),
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
}
