import { Component, OnInit, Input, ModuleWithComponentFactories } from '@angular/core';
import { DataService, IFilter } from 'src/app/service/data.service';
import { IOrderCar, IOrder } from 'src/app/model/data';
import { IData } from 'src/app/model/base';
import { Moment } from 'moment';
import * as _moment from 'moment';
const moment = (_moment as any).default ? (_moment as any).default : _moment;

interface IChartData {
  name: string;
  value: number;
}

interface IDateRange {
  startDate: Date;
  endDate: Date;
}

@Component({
  selector: 'app-rank-order',
  templateUrl: './rank-order.component.html',
  styleUrls: ['./rank-order.component.css']
})
export class RankOrderComponent implements OnInit {
  @Input() innerWidth: number;
  @Input() innerHeight: number;
  rankOrders: IChartData[] = [];
  max = 12;

  constructor(private dataService: DataService) { }

  ngOnInit() {
    this.setDatas(0);
  }
  setDatas(tag: number) {
    if (tag <= this.max) {
      this.setOrders(tag, this.setDate(tag));
    }
  }

  setDate(lastIndex: number): IDateRange {
    const obj = {
      startDate: null,
      endDate: null
    } as IDateRange;
    obj.startDate = moment()
      .month(moment().month() - lastIndex)
      .startOf('month');
    obj.endDate = moment()
      .month(moment().month() - lastIndex)
      .endOf('month');
    return obj;
  }

  setOrders(tag: number, range: IDateRange) {
    const filters: IFilter[] = [
      { key: 'status', val: 5 },
      { key: 'inserted_gte', val: range.startDate.valueOf() },
      { key: 'inserted_lte', val: range.endDate.valueOf() }
    ];
    this.dataService.getData('orders', null, filters).subscribe((data: IData) => {
      if (!data.errorCode && !!data.res) {
        const orders = data.res as IOrder[];
        this.settingOrder(tag, orders);
      } else {
        this.setDatas(++tag);
      }
    });
  }

  settingOrder(tag: number, orders: IOrder[]) {
    if (!!orders.length) {
      this.runPerOrder(tag, 0, orders);
    } else {
      this.setDatas(++tag);
    }
  }

  runPerOrder(tag: number, orderIndex: number, orders: IOrder[]) {
    const length = orders.length;
    if (orderIndex < length) {
      this.setPerOrder(tag, orderIndex, orders);
    } else {
      this.setRankOrders(tag, orders);
    }
  }

  setPerOrder(tag: number, orderIndex: number, orders: IOrder[]) {
    const order = orders[orderIndex];
    const filters: IFilter[] = [
      { key: 'orderId', val: order.id },
      { key: '_expand', val: 'product' }
    ];
    this.dataService.getData('cars', null, filters).subscribe((carData: IData) => {
      if (!carData.errorCode && !!carData.res) {
        const cars = carData.res as IOrderCar[];
        const sum = this.sumCars(cars);
        // tslint:disable-next-line: no-string-literal
        order['sum'] = sum;
      } else {
        // tslint:disable-next-line: no-string-literal
        order['sum'] = 0;
      }
      this.runPerOrder(tag, ++orderIndex, orders);
    });
  }

  sumCars(cars: IOrderCar[]): number {
    let sum = 0;
    if (!!cars && !!cars.length) {
      cars.forEach((car: IOrderCar) => {
        sum += car.product.price * car.amount;
      });
    }
    return sum;
  }

  setRankOrders(tag: number, orders: IOrder[]) {
    const total = orders
      .map((order: IOrder) => {
        // tslint:disable-next-line: no-string-literal
        return order['sum'];
      })
      .reduce((a: number, c: number) => {
        return a + c;
      }, 0);
    const obj = {
      name: this.setRankName(tag),
      value: total
    } as IChartData;
    this.rankOrders.push(obj);
    this.setDatas(++tag);
  }

  setRankName(tag: number): string {
    const nowMonth = moment().month() + 1;
    const tagMonth = nowMonth - tag;
    return `${tagMonth}`;
  }

}
