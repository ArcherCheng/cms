import { Injectable } from '@angular/core';
import { IUser } from '../model/data';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private uer: IUser = {
    id: 1,
    name: 'admin01',
    account: 'admin01',
    password: 'admin01',
    token: 'bc6e113d26ce620066237d5e43f14690',
    status: 1,
    holds: [
      {
        id: 1,
        adminId: 1,
        powerId: 1
      }, {
        id: 2,
        adminId: 1,
        powerId: 2
      }, {
        id: 3,
        adminId: 1,
        powerId: 3
      }, {
        id: 4,
        adminId: 1,
        powerId: 4
      }
    ]
  };

  constructor() {
    console.log('UserService.constructor:');
   }

  setOne(user: IUser) {
    console.log('UserService.setOne:', user);
    this.uer = Object.assign(this.uer, user);
  }

  setToken(token: string) {
    console.log('UserService.setToken:', token);
    this.uer = Object.assign(this.uer, {Token: token});
  }

  getUser() {
    console.log('UserService.getUser:');
    return this.uer;
  }

  delUser() {
    console.log('UserService.delUser:');
    this.uer = null;
  }
}
