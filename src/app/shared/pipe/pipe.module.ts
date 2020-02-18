import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagPipe } from './tag.pipe';
import { DatetimePipe } from './datetime.pipe';
import { TimePipe } from './pipe-time';



@NgModule({
  declarations: [TagPipe,  DatetimePipe, TimePipe],
  imports: [
    CommonModule
  ],
  exports: [TagPipe,  DatetimePipe, TimePipe]
})
export class PipeModule { }
