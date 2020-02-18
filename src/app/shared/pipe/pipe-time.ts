import { Pipe, PipeTransform } from '@angular/core';
// import moment from 'moment';
// import {Moment} from 'moment';
import { Moment } from 'moment';
import * as _moment from 'moment';
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Pipe({
  name: 'pipetime',
  pure: false
})
export class TimePipe implements PipeTransform {
  constructor() {}

  transform(value: string, args: string = 'YYYY-MM-DD HH:mm:ss'): any {
    return moment(value).format(args);
  }
}
