import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CmsResolver } from '../cms-resolver';
import { OrderListComponent } from './list/list.component';
import { OrderComponent } from './order.component';


const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
    children: [
      {
        path: 'list',
        component: OrderListComponent,
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
export class OrderRoutingModule { }
