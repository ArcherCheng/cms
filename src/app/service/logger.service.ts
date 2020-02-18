import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private isLogger = environment.logger;

  constructor() {
    console.log('LoggerService.constructor:');
  }

  log(msg: string) {
    console.log('LoggerService.log:', msg);
    if (this.isLogger) {
      console.log(msg);
    }
  }

  error(msg: string) {
    console.log('LoggerService.error:', msg);
    if (this.isLogger) {
      console.error(msg);
    }
  }

  print(index: string, msg: any) {
    console.log('LoggerService.print:', index, msg);
    if (this.isLogger) {
      console.log(index, msg);
    }
  }

}
