import { NgModule } from '@angular/core';
import { TabComponent } from './tab/tab.component';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [TabComponent],
  imports: [
    SharedModule
  ],
  exports: [ TabComponent ]
})
export class TabModule { }
