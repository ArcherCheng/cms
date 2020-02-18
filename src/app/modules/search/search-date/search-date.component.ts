import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Moment } from 'moment';
import { Search, IValid } from '../search';

interface IDateData {
  valid: boolean;
  value: Moment;
}

@Component({
  selector: 'app-search-date',
  templateUrl: './search-date.component.html',
  styleUrls: ['./search-date.component.css']
})
export class SearchDateComponent implements OnInit {
  @Input() searchObj: Search;
  @Input() toggleMb: boolean;
  @Output() searchSend: EventEmitter<Search> = new EventEmitter<Search>();
  startObj = { valid: false, value: null } as IDateData;
  endObj = { valid: false, value: null } as IDateData;

  constructor() { }

  ngOnInit() {
    this.init();
  }

  init() {
    this.startObj.value = this.searchObj.start;
    this.endObj.value = this.searchObj.end;
  }

  setDate(type: string, event) {
    if (type === 'start') {
      this.startObj.valid = event.valid;
      this.setSearch(type, this.startObj);
    } else {
      this.endObj.valid = event.valid;
      this.setSearch(type, this.endObj);
    }
    this.getSearch();
  }

  setSearch(type: string, obj: IDateData) {
    if (obj.valid) {
      this.searchObj[type] = obj.value;
    }
  }

  getSearch() {
    this.searchObj.setValidObjs( { type: 'start', valid: this.startObj.valid } as IValid);
    this.searchObj.setValidObjs( { type: 'end', valid: this.endObj.valid } as IValid);
    this.searchSend.emit(this.searchObj);
  }
}
