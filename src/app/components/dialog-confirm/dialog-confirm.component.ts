import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { IDialogConfirmData } from './types/IDialogConfirmData';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { IDialogConfirmResponse } from './types';

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
  readonly dialogRef = inject(MatDialogRef<DialogConfirmComponent, IDialogConfirmResponse>);
  readonly data = inject<IDialogConfirmData>(MAT_DIALOG_DATA);
  dialogResponse?: IDialogConfirmResponse = undefined;

  /**
   * 
   */
  onClickYes(): void {
    this.dialogResponse = { response: 'yes' };
    this.dialogRef.close(this.dialogResponse);
  }

  /**
   * 
   */
  onClickNo(): void {
    this.dialogResponse = { response: 'no' };
    this.dialogRef.close(this.dialogResponse);
  }
}
