import { Component, OnInit } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry, MatDialog } from '@angular/material';
import { TranslateService } from '@ngx-translate/core';

import { AppService } from './app.service';
import { SpinnerService } from './spinner/spinner.service';
import { DataService } from './service/data.service';
import { StorageService } from './service/storage.service';
import { LoginService } from './service/login.service';
import { UserService } from './service/user.service';
import { ICONS, LANG } from './config';
import { DialogComponent } from './shared/dialog/dialog.component';
import { IData } from './model/base';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'cms';

  constructor(
    private router: Router,
    private translate: TranslateService,
    private matIconRegistry: MatIconRegistry,
    private dialog: MatDialog,
    private domSanitizer: DomSanitizer,
    private service: AppService,
    private spinnerService: SpinnerService,
    private dataService: DataService,
    private storageService: StorageService,
    private loginService: LoginService,
    private userService: UserService
  ) {
    ICONS.forEach(val => {
      this.matIconRegistry.addSvgIcon(
        val.tab,
        this.domSanitizer.bypassSecurityTrustResourceUrl(val.path)
      );
    });
    const arr = LANG.map(item => {
      return item.short;
    });
    translate.addLangs(arr);
    const lang = this.storageService.getLangStorage();
    translate.setDefaultLang(lang);
    translate.use(lang);
  }

  ngOnInit(): void {
    if (!this.userService.getUser().token) {
        console.log(this.router.events);
        this.router.events.pipe(
          filter(event => event instanceof RoutesRecognized),
          take(1)
        )
        .subscribe((e: any) => {
          // tslint:disable-next-line: no-string-literal
          if (!!e.state.root.queryParams['token']) {
            console.log(e);
            // tslint:disable-next-line: no-string-literal
            this.setToken(e.state.root.queryParams['token']);
          } else {
            console.log(e);
            this.dialogOpen(1); // reconnect
          }
        });
    }
  }

  setToken(token: string) {
    if (!!token) {
      this.userService.setToken(token);
      this.spinnerService.load();
      this.dataService.connect(token).subscribe((data: IData) => {
        this.spinnerService.hide();
        if (!!data.errorCode) {
          this.dialogOpen(data.errorCode);
        } else {
          const user = data.res[0];
          this.setLogin(user.account);
          this.userService.setOne(user);
        }
      });
    }
  }

  dialogOpen(errorCode) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '550px',
      data: {
        errorCode
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.service.backLogin();
    });
  }

  setLogin(account: string) {
    this.storageService.setKey(account);
    this.loginService.login();
  }

}
