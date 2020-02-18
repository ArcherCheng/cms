import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { DialogUserPasswordComponent } from './user-password/user-password.component';
import { UserIndexComponent } from './user-index/user-index.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [DialogUserPasswordComponent, UserIndexComponent],
  imports: [
    SharedModule,
    UserRoutingModule
  ],
  exports: [UserIndexComponent],
  entryComponents: [DialogUserPasswordComponent]
})
export class UserModule { }
