import { Injectable } from '@angular/core';
import { AppService } from '../app.service';
import { StorageService } from '../service/storage.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class CoreService {
  private hamburgerSubject = new BehaviorSubject<string>('');

  constructor(
    private service: AppService,
    private storageService: StorageService,
    public translate: TranslateService
  ) {}

  nextHamburger(next: string) {
    this.hamburgerSubject.next(next);
  }

  isHamburgerIn(): Observable<string> {
    if (!!this.hamburgerSubject) {
      return this.hamburgerSubject.asObservable();
    }
    return null;
  }

  useLanguage(lang: string) {
    return this.translate.use(lang);
  }

  getNowLang() {
    return this.storageService.getLangStorage();
  }

  logout(): void {
    this.service.backLogin();
  }
}
