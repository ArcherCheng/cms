import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  private loginSubject = new Subject<boolean>();

  loginState = this.loginSubject.asObservable();

  constructor() { }

  login() {
    console.log('LoginService.login');
    this.loginSubject.next(true);
  }

  logout() {
    console.log('LoginService.logout');
    this.loginSubject.next(false);
  }
}
