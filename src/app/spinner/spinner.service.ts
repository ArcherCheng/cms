import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface SpinnerState {
  show: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private spinnerSubject = new Subject<SpinnerState>();
  spinnerState = this.spinnerSubject.asObservable();

  constructor() { }

  load() {
    this.spinnerSubject.next({show: true} as SpinnerState);
  }

  hide() {
    this.spinnerSubject.next({show: false} as SpinnerState);
  }
}
