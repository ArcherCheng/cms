import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './list/detail/detail.component';
import { FileUploadComponent } from './list/file-upload/file-upload.component';
import { DialogTypeComponent } from './dialog-type/dialog-type.component';


@NgModule({
  declarations: [ListComponent, DetailComponent, FileUploadComponent, DialogTypeComponent],
  imports: [
    CommonModule,
    ProductRoutingModule
  ]
})
export class ProductModule { }
