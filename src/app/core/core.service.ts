import { Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { StorageService } from '../service/storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable(
  {  providedIn: 'root'  }
)
export class CoreService {
  private hamburgerSubject = new BehaviorSubject<string>('');

  constructor(
    private service: AppService,
    private storageService: StorageService,
    public translate: TranslateService
  ) {
    console.log('CoreService.constructor');
  }

  nextHamburger(next: string) {
    console.log('CoreService.nextHamburger', next);
    this.hamburgerSubject.next(next);
  }

  isHamburgerIn(): Observable<string> {
    console.log('CoreService.isHamburgerIn');
    if (!!this.hamburgerSubject) {
      return this.hamburgerSubject.asObservable();
    }
    return null;
  }

  useLanguage(lang: string) {
    console.log('CoreService.useLanguage', lang);
    return this.translate.use(lang);
  }

  getNowLang() {
    console.log('CoreService.getNowLang');
    return this.storageService.getLangStorage();
  }

  logout(): void {
    console.log('CoreService.logout');
    this.service.backLogin();
  }
}
