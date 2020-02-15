import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './list/detail/detail.component';
import { DialogLevelComponent } from './dialog-level/dialog-level.component';


@NgModule({
  declarations: [ListComponent, DetailComponent, DialogLevelComponent],
  imports: [
    CommonModule,
    CustomerRoutingModule
  ]
})
export class CustomerModule { }
