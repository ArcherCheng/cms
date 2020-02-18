import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerListComponent } from './list/list.component';
import { CustomerComponent } from './customer.component';
import { CmsResolver } from '../cms-resolver';


const routes: Routes = [
  {
    path: '',
    component: CustomerComponent,
    children: [
      {
        path: 'list',
        component: CustomerListComponent,
        resolve: { listTab: CmsResolver }
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
