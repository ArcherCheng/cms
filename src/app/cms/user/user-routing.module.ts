import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserIndexComponent } from './user-index/user-index.component';
import { CmsResolver } from '../cms-resolver';


const routes: Routes = [
  {
    path: '',
    component: UserIndexComponent,
    resolve: { listTab: CmsResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
