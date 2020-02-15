import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CoreComponent } from './core/core.component';
import { CoreGuard } from './core.guard';
import { CmsRouting } from '../cms/cms-routing';
import { CmsResolver } from '../cms/cms-resolver';

const routes: Routes = [
  {
    path: 'cms',
    component: CoreComponent,
    canActivate: [CoreGuard],
    children: CmsRouting
  },
  { path: '', redirectTo: 'cms', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [CmsResolver]
})
export class CoreRoutingModule {}
