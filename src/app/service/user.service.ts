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

  constructor() { }

  setOne(user: IUser) {
    this.uer = Object.assign(this.uer, user);
  }

  setToken(token: string) {
    this.uer = Object.assign(this.uer, {Token: token});
  }

  getUser() {
    // console.log(this.uer);
    return this.uer;
  }

  delUser() {
    this.uer = null;
  }
}
