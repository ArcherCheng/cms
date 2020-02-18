import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProductListComponent } from './list/list.component';
import { CmsResolver } from '../cms-resolver';
import { ProductComponent } from './product.component';

const routes: Routes = [
  {
  path: '',
  component: ProductComponent,
  children: [
    {
      path: 'list',
      component: ProductListComponent,
      resolve: { listTab: CmsResolver }
    },
    { path: '', redirectTo: 'list', pathMatch: 'full' }
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProductRoutingModule { }
