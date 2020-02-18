import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ITabMain, ITabBase } from 'src/app/modules/tab/tabs';

@Injectable({
  providedIn: 'root'
})
export class TabService {
  private tabMainSubject = new BehaviorSubject<ITabMain>(null);
  private tabSubject = new BehaviorSubject<ITabBase>(null);

  constructor() {
    console.log('TabService.constructor');
  }

  nextTab(listTab: ITabBase) {
    console.log('TabService.nextTab', listTab);
    this.tabSubject.next(listTab);
  }

  isTabIn(): Observable<ITabBase> {
    console.log('TabService.isTabIn');
    if (!!this.tabSubject) {
      return this.tabSubject.asObservable();
    }
    return null;
  }

  nextTabMain(listTabMain: ITabMain) {
    console.log('TabService.nextTabMain', listTabMain);
    this.tabMainSubject.next(listTabMain);
  }

  isTabMainIn(): Observable<ITabMain> {
    console.log('TabService.isTabMainIn');
    if (!!this.tabMainSubject) {
      return this.tabMainSubject.asObservable();
    }
    return null;
  }
}
