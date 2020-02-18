import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Search } from '../search';

@Component({
  selector: 'app-search-input',
  templateUrl: './search-input.component.html',
  styleUrls: ['./search-input.component.css']
})
export class SearchInputComponent implements OnInit {
  @Input() label: string;
  @Input() selectLabel: string;
  @Input() textHolder: string;
  @Input() searchObj: Search;
  @Output() searchSend: EventEmitter<Search> = new EventEmitter<Search>();
  isNumber = false;
  searchValue: string;
  constructor() { }

  ngOnInit() {
    this.init();
  }

  init() {
    if (!!this.selectLabel) {
      switch (this.selectLabel) {
        case 'id':
          this.isNumber = true;
          this.searchValue = this.searchObj.idSel;
          break;
        case 'name':
          this.searchValue = this.searchObj.name;
          break;
      }
    }
  }

  setSearch() {
    switch (this.selectLabel) {
      case 'id':
        this.searchObj.idSel = this.searchValue;
        break;
      case 'name':
        this.searchObj.name = this.searchValue;
        break;
    }
  }

  resetSearchValue() {
    this.searchValue = '';
  }

  validSearch(event) {
    const obj = { type: this.selectLabel, valid: event.valid };
    this.searchObj.setValidObjs(obj);
    this.getSearch();
  }

  getSearch(reset = false) {
    if (reset) {
      this.resetSearchValue();
      const obj = { type: this.selectLabel, valid: true };
      this.searchObj.setValidObjs(obj);
    }
    this.setSearch();
    this.searchSend.emit(this.searchObj);
  }
}
