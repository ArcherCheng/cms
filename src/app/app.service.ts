import { Injectable } from '@angular/core';
import { LoginService } from './service/login.service';
import { UserService } from './service/user.service';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(
    private loginService: LoginService,
    private userService: UserService
  ) {
    console.log('AppService.constructor:');
  }

  backLogin() {
    console.log('AppService.backLogin:');
    this.userService.delUser();
    this.loginService.login();
    // window.location.href = LoginUrl;
  }

}
