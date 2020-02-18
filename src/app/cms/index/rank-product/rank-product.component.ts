import { Component, OnInit, Input } from '@angular/core';
import { IFilter, DataService } from 'src/app/service/data.service';
import { IOrder, IOrderCar } from 'src/app/model/data';
import { IData } from 'src/app/model/base';
import * as _moment from 'moment';
import { Moment } from 'moment';
const moment = (_moment as any).default ? (_moment as any).default : _moment;

interface IChartData {
  name: string;
  value: number;
}

interface IDateRange {
  startDate: Date; // Moment;
  endDate: Date;  // Moment;
}

interface IAmountProduct {
  productName: string;
  totalAmount: number;
}

@Component({
  selector: 'app-rank-product',
  templateUrl: './rank-product.component.html',
  styleUrls: ['./rank-product.component.css']
})
export class RankProductComponent implements OnInit {
  @Input() innerWidth: number;
  @Input() innerHeight: number;
  rankProducts: IChartData[] = [];
  sumProducts: { [key: number]: number } = {};
  max = 12;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.setDatas();
  }

  setDate(): IDateRange {
    const obj =  {
      startDate: null,
      endDate: null
    } as IDateRange;
    obj.startDate = moment().startOf('month').add(-10, 'month');
    obj.endDate = moment()
      .startOf('month')
      .add(1, 'months');
    return obj;
  }

  setDatas() {
    this.setOrders(this.setDate());
  }

  setOrders(range: IDateRange) {
    const filters: IFilter[] = [
      { key: 'status', val: 5 },
      { key: 'inserted_gte', val: range.startDate.valueOf() },
      { key: 'inserted_lte', val: range.endDate.valueOf() }
    ];
    this.dataService.getData('orders', null, filters).subscribe((data: IData) => {
      if (!data.errorCode && !!data.res) {
        const orders =  data.res as IOrder[];
        this.runPerOrder(0, orders);
      }
    });
  }

  runPerOrder(orderIndex: number, orders: IOrder[]) {
    const length = orders.length;
    if (orderIndex < length) {
      this.setPerOrder(orderIndex, orders);
    } else {
      this.setRankProducts();
    }
  }

  setPerOrder(orderIndex: number, orders: IOrder[]) {
    const order = orders[orderIndex];
    const filters: IFilter[] = [
      { key: 'orderId', val: order.id },
      { key: '_expand', val: 'product' }
    ];
    this.dataService.getData('cars', null, filters).subscribe((carData: IData) => {
      if (!carData.errorCode && !!carData.res) {
        const cars =  carData.res as IOrderCar[];
        this.setPerProduct(cars);
      }
      this.runPerOrder(++orderIndex, orders);
    });
  }

  setPerProduct(cars: IOrderCar[]) {
    cars.forEach((car: IOrderCar) => {
      if (!this.sumProducts[car.product.name]) {
        this.sumProducts[car.product.name] = 0;
      }
      this.sumProducts[car.product.name] = this.sumProducts[car.product.name] + car.amount;
    });
  }

  setRankProducts() {
    let arrs: IAmountProduct[] = [];
    arrs = this.sortRankProducts(arrs);
    if (!!arrs && !!arrs.length) {
      this.rankProducts = [];
      const max = arrs.length - 1 < this.max ? arrs.length - 1 : this.max;
      for (let i = 0; i <= max; i++) {
        this.rankProducts.push({
          name: arrs[i].productName,
          value: arrs[i].totalAmount
        });
      }
    }
  }

  sortRankProducts(arrs: IAmountProduct[]): IAmountProduct[] {
    const keys = Object.keys(this.sumProducts);
    keys.forEach((k: string) => {
      const obj =  {
        productName: k,
        totalAmount: this.sumProducts[k]
      } as IAmountProduct;
      arrs.push(obj);
    });
    arrs.sort((a, b) => {
      if (a.totalAmount < b.totalAmount) {
        return 1;
      }
      if (a.totalAmount > b.totalAmount) {
        return -1;
      }
      return 0;
    });
    return arrs;
  }

}
