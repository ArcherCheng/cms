import { NgModule } from '@angular/core';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerListComponent } from './list/list.component';
import { DialogCustomerDetailComponent } from './list/detail/detail.component';
import { DialogCustomerLevelComponent } from './dialog-level/dialog-level.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { SearchModule } from 'src/app/modules/search/search.module';
import { CustomerComponent } from './customer.component';


@NgModule({
  declarations: [
    CustomerComponent,
    CustomerListComponent,
    DialogCustomerLevelComponent,
    DialogCustomerDetailComponent
  ],
  imports: [
    SharedModule,
    SearchModule,
    CustomerRoutingModule
  ],
  exports: [CustomerComponent],
  providers: [],
  entryComponents: [DialogCustomerDetailComponent, DialogCustomerLevelComponent]
})
export class CustomerModule { }
