import { Component, OnInit } from '@angular/core';
import { ILevel, ICustomer } from 'src/app/model/data';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { DialogCustomerLevelComponent } from '../dialog-level/dialog-level.component';
import { IData, IPage } from 'src/app/model/base';
import { IFilter, DataService } from 'src/app/service/data.service';
import { ITabMain, ITabBase } from 'src/app/modules/tab/tabs';
import { PAGESIZE, ACCOUNTSTATUS, PAGESIZEOPTIONS } from 'src/app/config';
import { Search } from 'src/app/modules/search/search';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/service/user.service';
import { TabService } from 'src/app/modules/tab/tab.service';
import { IDetailCustomer, DialogCustomerDetailComponent } from './detail/detail.component';

@Component({
  selector: 'app-customer-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class CustomerListComponent implements OnInit {
  ACCOUNTSTATUS = ACCOUNTSTATUS;
  PAGESIZEOPTIONS = PAGESIZEOPTIONS;
  isLoadingToggle = true;
  tab: ITabBase;
  result: ICustomer[] = [];
  levels: ILevel[] = [];

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private dataService: DataService,
    private userService: UserService,
    private tabService: TabService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(resolversData => {
      this.tab = resolversData.listTab;
      if (!!this.tab) {
        this.init();
      }
    });
  }

  /*初始 */
  init() {
    if (!this.tab.pageObj) {
      this.tab.pageObj =  {
        pageIndex: 0,
        pageSize: PAGESIZE,
        length: 0
      } as IPage;
    }
    if (!this.tab.searchObj) {
      this.tab.searchObj = new Search();
      this.tab.searchObj.expand = 'level';
    } else {
      this.tab.searchObj = Object.assign(new Search(), this.tab.searchObj);
    }
    this.setDatas(true);
    this.setLevelDatas();
  }

  /*換分頁 */
  onSetPage(pageObj: IPage) {
    this.tab.pageObj.pageIndex = pageObj.pageIndex;
    this.tab.pageObj.pageSize = pageObj.pageSize;
    this.setDatas();
  }

  /*搜尋 */
  onSearch() {
    this.tab.pageObj.pageIndex = 0;
    this.setDatas();
  }

  /*裝載資料 */
  setDatas(isDataInit = false) {
    this.isLoadingToggle = true;
    this.dataService
      .getData('customers', null, this.setSearchFilters(), this.tab.pageObj)
      .subscribe((data: IData) => {
        this.isLoadingToggle = false;
        if (!!data.errorCode) {
          this.openStatusDialog(data.errorCode);
        } else {
          if (!!data.res) {
            this.result =  data.res as ICustomer[];
            this.setLoadingDatas(isDataInit);
          }
        }
      });
  }

  setLoadingDatas(isDataInit = false) {
    if (!isDataInit) {
      this.tabService.nextTabMain( {
        request: 'update',
        content: this.tab
      } as ITabMain);
    }
  }

  /*搜尋條件 */
  setSearchFilters(): IFilter[] {
    const f: IFilter[] = [];
    const s = this.tab.searchObj.getSearch();
    const keys = Object.keys(s);
    keys.forEach((item: string) => {
      f.push({
        key: item,
        val: s[item]
      });
    });
    return f;
  }

  setLevelDatas() {
    this.dataService.getData('levels').subscribe((data: IData) => {
      if (!!data.errorCode) {
        this.openStatusDialog(data.errorCode);
      } else {
        if (!!data.res) {
          this.levels =  data.res as ILevel[];
        }
      }
    });
  }

  /*開Dialog */
  openDialog(action: string, select?: ICustomer) {
    switch (action) {
      case 'insert':
        this.openDetailDialog();
        break;
      case 'update':
        this.openDetailDialog(select);
        break;
      case 'level':
        this.openLevelDialog();
        break;
    }
  }

  openDetailDialog(select?: ICustomer) {
    if (!!this.levels && !!this.levels.length) {
      const obj =  {
        customer: null,
        levels: this.levels
      } as IDetailCustomer;
      if (!!select) {
        obj.customer = select;
      }
      const dialogRef = this.dialog.open(DialogCustomerDetailComponent, {
        width: '600px',
        data: obj
      });
      dialogRef.afterClosed().subscribe((o: ICustomer) => {
        if (!!o) {
          if (!select) {
            this.insertCustomer(o);
          } else {
            this.updateCustomer(o, select);
          }
        }
      });
    }
  }

  insertCustomer(o: ICustomer) {
    o =  this.dataService.checkData(o, this.userService.getUser().id) as ICustomer;
    this.dataService.insertOne('customers', o).subscribe((data: IData) => {
      this.openStatusDialog(data.errorCode);
    });
  }

  updateCustomer(o: ICustomer, select: ICustomer) {
    o =  this.dataService.checkData(o, this.userService.getUser().id, false) as ICustomer;
    this.dataService.updateOne('customers', o, select.id).subscribe((data: IData) => {
      this.openStatusDialog(data.errorCode);
    });
  }

  openLevelDialog() {
    if (!!this.levels && !!this.levels.length) {
      const obj = {
        levelNames: this.levels.map((level: ILevel) => {
          return level.name;
        })
      };
      const dialogRef = this.dialog.open(DialogCustomerLevelComponent, {
        width: '600px',
        data: obj
      });

      dialogRef.afterClosed().subscribe((levelNames: string[]) => {
        if (!!levelNames && !!levelNames.length) {
          this.runAction(0, levelNames);
        }
      });
    }
  }

  runAction(index: number, levelNames: string[]) {
    const length = levelNames.length;
    const oldLength = this.levels.length;
    if (index < oldLength) {
      this.updateLevelNames(index, levelNames);
    } else {
      if (index < length) {
        this.insertLevelNames(index, levelNames);
      } else {
        this.setLevelDatas();
        this.openStatusDialog(0);
      }
    }
  }

  updateLevelNames(index: number, levelNames: string[]) {
    this.dataService.updateOne('levels', { name: levelNames[index] }, index + 1).subscribe(() => {
      this.runAction(++index, levelNames);
    });
  }

  insertLevelNames(index: number, levelNames: string[]) {
    this.dataService.insertOne('levels',  { name: levelNames[index] } as ILevel).subscribe(() => {
      this.runAction(++index, levelNames);
    });
  }

  openStatusDialog(errorCode: number) {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '250px',
      data: {
        errorCode
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.setDatas();
    });
  }

}
