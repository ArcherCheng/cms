import { NgModule } from '@angular/core';

import { ProductRoutingModule } from './product-routing.module';
import { ProductListComponent } from './list/list.component';
import { DialogProductDetailComponent } from './list/detail/detail.component';
import { FileUploadComponent } from './list/file-upload/file-upload.component';
import { DialogProductTypeComponent } from './dialog-type/dialog-type.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { PreviewModule } from 'src/app/modules/preview/preview.module';
import { SearchModule } from 'src/app/modules/search/search.module';
import { ProductComponent } from './product.component';


@NgModule({
  declarations: [
    ProductComponent,
    ProductListComponent,
    DialogProductTypeComponent,
    DialogProductDetailComponent,
    FileUploadComponent
  ],
  imports: [
    SharedModule,
    PreviewModule,
    SearchModule,
    ProductRoutingModule
  ],
  exports: [ProductComponent],
  providers: [],
  entryComponents: [DialogProductTypeComponent, DialogProductDetailComponent]

})
export class ProductModule { }
