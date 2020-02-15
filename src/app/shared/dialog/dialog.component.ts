import { Component, OnInit, Inject } from '@angular/core';
import { ErrorCodeMsg } from 'src/app/config';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})
export class DialogComponent implements OnInit {
  private errorCodeMsg = ErrorCodeMsg;

  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { errorCode: number }
  ) { }

  ngOnInit() {
    this.dialogRef.keydownEvents().pipe(
      filter((e: KeyboardEvent) => e.key === 'Enter'),
      take(1)
    ).subscribe(() => {
      this.dialogRef.close();
    });
  }

  getMsgName(): string {
    if (!!this.data) {
      const result = this.errorCodeMsg.filter(item => item.code === this.data.errorCode);
      return !!result.length ? result[0].name : 'err_fail';

    }
  }

}
