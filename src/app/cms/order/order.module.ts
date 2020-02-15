import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { ListComponent } from './list/list.component';
import { CarComponent } from './list/car/car.component';
import { DetailComponent } from './list/detail/detail.component';


@NgModule({
  declarations: [ListComponent, CarComponent, DetailComponent],
  imports: [
    CommonModule,
    OrderRoutingModule
  ]
})
export class OrderModule { }
