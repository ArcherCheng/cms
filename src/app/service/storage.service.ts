import { Injectable } from '@angular/core';
import { Md5 } from 'ts-md5';
import { UserKey, LangKey } from '../config';
import { ITabBase } from '../modules/tab/tabs';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  defaultLangVal = 'tw';
  key = '';

  constructor() {
    console.log('StorageServices.constructor:');
   }

  setKey(account: string) {
    console.log('StorageServices.etKey:', account);
    this.key = JSON.stringify(Md5.hashStr(account + UserKey));
    this.getStorage();
  }

  setStorage(listTabs: ITabBase[]) {
    console.log('StorageService.setStorage:', listTabs);
    sessionStorage.setItem(this.key, JSON.stringify(listTabs));
  }

  getStorage(): ITabBase[] {
    console.log('StorageService.getStorage:');
    if (!sessionStorage.getItem(this.key)) {
      this.setStorage([]);
    }
    return JSON.parse(sessionStorage.getItem(this.key));
  }

  setLangStorage(lang: string) {
    console.log('StorageService.setLangStorage:', lang);
    sessionStorage.setItem(LangKey, lang);
  }

  getLangStorage() {
    console.log('StorageService.getLangStorage:');
    if (!sessionStorage.getItem(LangKey)) {
      this.setLangStorage(this.defaultLangVal);
    }
    return sessionStorage.getItem(LangKey);
  }

  delStorage() {
    console.log('StorageService.delStorage:');
    sessionStorage.clear();
  }

}
