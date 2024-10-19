import { Component, inject, model, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { IDialogRequestHistoryData, IDialogRequestHistoryResult } from './types';

@Component({
  selector: 'app-dialog-requests-history',
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
  ],
  templateUrl: './dialog-requests-history.component.html',
  styleUrl: './dialog-requests-history.component.scss'
})
export class DialogRequestsHistoryComponent implements OnInit {
  readonly dialogRef = inject(MatDialogRef<DialogRequestsHistoryComponent, IDialogRequestHistoryResult>);
  readonly data = inject<IDialogRequestHistoryData>(MAT_DIALOG_DATA);
  readonly modelDialogData = model(this.data);
  dialogResult?: IDialogRequestHistoryResult = undefined;


  /**
   * Component has been initialized
   */
  ngOnInit() {
  }


  /**
   * Clicked button 'Ok' in dialog.
   */
  onClickOk(): void {
    this.dialogRef.close(this.dialogResult);
  }


  /**
   * Clicked button 'Cancel' in dialog
   */
  onClickCancel(): void {
    this.dialogRef.close();
  }
}
