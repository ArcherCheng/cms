import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IndexRoutingModule } from './index-routing.module';
import { IndexComponent } from './index/index.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RankOrderComponent } from './rank-order/rank-order.component';
import { RankProductComponent } from './rank-product/rank-product.component';


@NgModule({
  declarations: [IndexComponent, RankOrderComponent, RankProductComponent],
  imports: [
    SharedModule,
    IndexRoutingModule
  ],
  exports: [IndexComponent]
})
export class IndexModule { }
