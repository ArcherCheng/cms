import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggerService {
  private isLogger = environment.logger;

  constructor() { }

  log(msg: string) {
    if (this.isLogger) {
      console.log(msg);
    }
  }

  error(msg: string) {
    if (this.isLogger) {
      console.error(msg);

    }
  }

  print(index: string, msg: any) {
    if (this.isLogger) {
      console.log(index, msg);
    }
  }

}
