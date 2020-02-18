import { IPage } from '../../model/base';
import { Search } from '../search/search';

export interface ITabBase {
  tag: string;
  path: string;
  pageObj: IPage;
  unix: string;
  searchObj: Search;
}

export interface ITabMain {
  request: string;  // insert, update
  content: ITabBase;
}


