import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchDateComponent } from './search-date/search-date.component';
import { SearchInputComponent } from './search-input/search-input.component';
import { SearchSelectComponent } from './search-select/search-select.component';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  DateTimeAdapter,
  OWL_DATE_TIME_FORMATS,
  OWL_DATE_TIME_LOCALE,
  OwlDateTimeModule,
  OwlNativeDateTimeModule
} from 'ng-pick-datetime';

import { MomentDateTimeAdapter, OWL_MOMENT_DATE_TIME_FORMATS } from 'ng-pick-datetime-moment';


@NgModule({
  declarations: [SearchDateComponent, SearchInputComponent, SearchSelectComponent],
  imports: [
    SharedModule, OwlDateTimeModule, OwlNativeDateTimeModule
  ],
  exports: [
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    SearchSelectComponent,
    SearchInputComponent,
    SearchDateComponent
  ],
  providers: [
    {
      provide: DateTimeAdapter,
      useClass: MomentDateTimeAdapter,
      deps: [OWL_DATE_TIME_LOCALE]
    },
    {
      provide: OWL_DATE_TIME_FORMATS,
      useValue: OWL_MOMENT_DATE_TIME_FORMATS
    }
  ],
})
export class SearchModule { }
