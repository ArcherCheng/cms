import { Component, OnInit } from '@angular/core';
import { IUser } from 'src/app/model/data';
import { MatDialog } from '@angular/material';
import { DataService } from 'src/app/service/data.service';
import { UserService } from 'src/app/service/user.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { DialogUserPasswordComponent, IPassword } from '../user-password/user-password.component';
import { take } from 'rxjs/operators';
import { IData } from 'src/app/model/base';

@Component({
  selector: 'app-user-index',
  templateUrl: './user-index.component.html',
  styleUrls: ['./user-index.component.css']
})
export class UserIndexComponent implements OnInit {
  user: IUser;

  constructor(
    public dialog: MatDialog,
    private dataService: DataService,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.setDatas();
  }

  /*裝載資料 */
  setDatas() {
    this.user = this.userService.getUser();
  }

  /*開Dialog */
  openDialog(action: string) {
    switch (action) {
      case 'password':
        this.openPasswordDialog();
        break;
    }
  }

  /*Show Password Dialog */
  openPasswordDialog(): void {
    const dialogRef = this.dialog.open(DialogUserPasswordComponent, {
      width: '620px'
    });
    dialogRef
      .beforeClosed()
      .pipe(take(1))
      .subscribe((passwords: IPassword) => {
        if (!!passwords) {
          this.savePassword(passwords);
        }
      });
  }

  /*更新密碼 */
  savePassword(passwords: IPassword) {
    if (!!passwords.old && !!passwords.new) {
      const obj = this.dataService.checkData(
         { password: passwords.new } as IUser,
        this.userService.getUser().id
      );
      this.dataService.updateOne('admins', obj, this.user.id).subscribe((data: IData) => {
        this.openStatusDialog(data.errorCode);
        if (!data.errorCode) {
          this.userService.setOne( data.res as IUser);
        }
      });
    }
  }

  openStatusDialog(errorCode: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {
        errorCode
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.setDatas();
    });
  }
}
