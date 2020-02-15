import { IPage } from './base';
// import { Search } from '../modules/search/search';

export interface ITabBase {
  tag: string;
  path: string;
  pageObj: IPage;
  unix: string;
  // searchObj: Search;
}

export interface ITabMain {
  request: string;
  content: ITabBase;
}


