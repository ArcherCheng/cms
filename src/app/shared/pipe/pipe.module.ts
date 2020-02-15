import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagPipe } from './tag.pipe';
import { DatetimePipe } from './datetime.pipe';



@NgModule({
  declarations: [TagPipe,  DatetimePipe],
  imports: [
    CommonModule
  ]
})
export class PipeModule { }
