import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { IDialogDataConfirm } from './types/IDialogDataConfirm';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-dialog-confirm',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatDividerModule,
    MatButtonModule,
  ],
  templateUrl: './dialog-confirm.component.html',
  styleUrl: './dialog-confirm.component.scss'
})
export class DialogConfirmComponent {
  readonly dialogRef = inject(MatDialogRef<DialogConfirmComponent>);
  readonly data = inject<IDialogDataConfirm>(MAT_DIALOG_DATA);

  /**
   * 
   */
  onClickYes(): void {
    this.dialogRef.close(true);
  }

  /**
   * 
   */
  onClickNo(): void {
    this.dialogRef.close(false);
  }
}
