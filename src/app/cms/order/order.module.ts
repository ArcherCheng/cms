import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderListComponent } from './list/list.component';
import { CarComponent } from './list/car/car.component';
import { DialogOrderDetailComponent } from './list/detail/detail.component';
import { OrderComponent } from './order.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PreviewModule } from 'src/app/modules/preview/preview.module';
import { SearchModule } from 'src/app/modules/search/search.module';


@NgModule({
  declarations: [OrderListComponent, CarComponent, DialogOrderDetailComponent, OrderComponent],
  imports: [
    SharedModule,
    PreviewModule,
    SearchModule,
    OrderRoutingModule
  ],
  exports: [OrderComponent],
  providers: [],
  entryComponents: [DialogOrderDetailComponent]
})
export class OrderModule { }
