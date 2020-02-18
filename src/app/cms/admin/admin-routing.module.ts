import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin.component';
import { AdminListComponent } from './list/list.component';
import { CmsResolver } from '../cms-resolver';


const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: 'list',
        component: AdminListComponent,
        resolve: {listTab: CmsResolver}
      }, {
        path: '', redirectTo: 'list', pathMatch: 'full'
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
