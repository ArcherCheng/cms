import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { DialogAdminInsertComponent } from './list/insert/dialog-insert.component';
import { AdminPowerComponent } from './list/power/power.component';
import { AdminPowerMainComponent } from './list/power-main/power-main.component';
import { AdminListComponent } from './list/list.component';
import { AdminComponent } from './admin.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AdminComponent, DialogAdminInsertComponent, AdminPowerComponent, AdminPowerMainComponent, AdminListComponent],
  imports: [
    SharedModule,
    AdminRoutingModule
  ],
  exports: [AdminComponent],
  entryComponents: [DialogAdminInsertComponent]
})
export class AdminModule { }
