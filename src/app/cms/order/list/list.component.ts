import { Component, OnInit } from '@angular/core';
import { ORDERSTATUS, PAGESIZE, PAGESIZEOPTIONS } from 'src/app/config';
import { ITabBase, ITabMain } from 'src/app/modules/tab/tabs';
import { ChildToggle } from '../../child-toggle';
import { IOrder, IOrderCar } from 'src/app/model/data';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { DataService, IFilter } from 'src/app/service/data.service';
import { UserService } from 'src/app/service/user.service';
import { TabService } from 'src/app/modules/tab/tab.service';
import { IPage, IData } from 'src/app/model/base';
import { Search } from 'src/app/modules/search/search';
import * as _moment from 'moment';
import { IDetailOrder, DialogOrderDetailComponent } from './detail/detail.component';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
const moment = (_moment as any).default ? (_moment as any).default : _moment;

@Component({
  selector: 'app-order-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class OrderListComponent implements OnInit {
  ORDERSTATUS = ORDERSTATUS;
  PAGESIZEOPTIONS = PAGESIZEOPTIONS;
  isLoadingToggle = true;
  tab: ITabBase;
  childToggle = new ChildToggle('id', '', 0);
  result: IOrder[] = [];
  cars: IOrderCar[] = [];

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
      this.tab.searchObj.setSearchDate('month');
      this.tab.searchObj.expand = 'customer';
    } else {
      this.tab.searchObj = Object.assign(new Search(), this.tab.searchObj);
      this.tab.searchObj.start = new moment(this.tab.searchObj.start);
      this.tab.searchObj.end = new moment(this.tab.searchObj.end);
    }
    this.setDatas(true);
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

  setDatas(isDataInit = false) {
    this.isLoadingToggle = true;
    this.dataService
      .getData('orders', null, this.setFilters(), this.tab.pageObj)
      .subscribe((data: IData) => {
        this.isLoadingToggle = false;
        if (!!data.errorCode) {
          this.openStatusDialog(data.errorCode);
        } else {
          if (!!data.res) {
            this.result =  data.res as IOrder[];
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

  setFilters(): IFilter[] {
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

  /*開Dialog */
  openDialog(action: string, select?: IOrder) {
    this.childToggle.reset();
    switch (action) {
      case 'insert':
        this.openDetailDialog();
        break;
      case 'update':
        this.openDetailDialog(select);
        break;
    }
  }

  openDetailDialog(select?: IOrder) {
    const obj =  {
      order: null,
      oldCars: [],
      cars: []
    } as IDetailOrder;
    if (!!select) {
      obj.order = select;
    }
    const dialogRef = this.dialog.open(DialogOrderDetailComponent, {
      width: '800px',
      data: obj
    });
    dialogRef.afterClosed().subscribe((o: IDetailOrder) => {
      if (!!o && !!o.order) {
        if (!select) {
          this.insertOrder(o);
        } else {
          this.updateOrder(o, select);
        }
      }
    });
  }

  insertOrder(o: IDetailOrder) {
    o.order =  this.dataService.checkData(o.order, this.userService.getUser().id) as IOrder;
    this.dataService.insertOne('orders', o.order).subscribe((data: IData) => {
      if (!!data.errorCode) {
        this.openStatusDialog(data.errorCode);
      } else {
        const order =  data.res as IOrder;
        this.runInsertCars(0, o.cars, order.id);
      }
    });
  }

  updateOrder(o: IDetailOrder, select: IOrder) {
    o.order =  this.dataService.checkData(o.order, this.userService.getUser().id, false) as IOrder;
    this.dataService.updateOne('orders', o.order, select.id).subscribe((data: IData) => {
      if (!!data.errorCode) {
        this.openStatusDialog(data.errorCode);
      } else {
        if (!!o.oldCars.length) {
          this.runDelCars(0, o.oldCars, select.id, o.cars);
        } else {
          this.runInsertCars(0, o.cars, select.id);
        }
      }
    });
  }

  runDelCars(index: number, oldCars: IOrderCar[], orderId: number, cars: IOrderCar[]) {
    const length = oldCars.length;
    if (index < length) {
      this.delCars(index, oldCars, orderId, cars);
    } else {
      this.runInsertCars(0, cars, orderId);
    }
  }

  delCars(index: number, oldCars: IOrderCar[], orderId: number, cars: IOrderCar[]) {
    this.dataService.deleteOne('cars', oldCars[index].id).subscribe(() => {
      this.runDelCars(++index, oldCars, orderId, cars);
    });
  }

  runInsertCars(index: number, cars: IOrderCar[], orderId: number) {
    const length = cars.length;
    if (index < length) {
      this.insertCars(index, cars, orderId);
    } else {
      this.openStatusDialog(0);
    }
  }

  insertCars(index: number, cars: IOrderCar[], orderId: number) {
    const obj =  {
      orderId,
      productId: cars[index].productId,
      amount: cars[index].amount
    } as IOrderCar;
    this.dataService.insertOne('cars', obj).subscribe(() => {
      this.runInsertCars(++index, cars, orderId);
    });
  }

  /*開子組件 */
  onOpenChild(action: string, select: IOrder) {
    if (!!this.childToggle && !!select) {
      if (
        select[this.childToggle.selectMarkID] === this.childToggle.selectId &&
        action === this.childToggle.selectTag
      ) {
        this.childToggle.reset();
        return;
      }
      this.childToggle.setData(action, select[this.childToggle.selectMarkID]);
    }
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
