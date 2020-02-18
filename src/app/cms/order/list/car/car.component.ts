import { Component, OnInit, Input } from '@angular/core';
import { IOrder, IOrderCar } from 'src/app/model/data';
import { DataService, IFilter } from 'src/app/service/data.service';
import { IData } from 'src/app/model/base';

@Component({
  selector: 'app-order-car',
  templateUrl: './car.component.html',
  styleUrls: ['./car.component.css']
})
export class CarComponent implements OnInit {
  @Input() order: IOrder = null;
  cars: IOrderCar[] = [];

  constructor(private dataService: DataService) {}

  ngOnInit() {
    if (!!this.order) {
      this.setDatas();
    }
  }

  setDatas() {
    const filters: IFilter[] = [
      { key: 'orderId', val: this.order.id },
      { key: '_expand', val: 'product' }
    ];
    this.dataService.getData('cars', null, filters).subscribe((data: IData) => {
      if (!data.errorCode && !!data.res) {
        this.cars =  data.res as IOrderCar[];
      }
    });
  }

  getSum(index: number, price = 0, amount = 0): number {
    const sum = price * amount;
    // tslint:disable-next-line: no-string-literal
    this.cars[index]['sum'] = sum;
    return sum;
  }

  getTotal(): number {
    let t = 0;
    if (!!this.cars && !!this.cars.length) {
      t = this.cars
        .map((car: IOrderCar) => {
          // tslint:disable-next-line: no-string-literal
          return car['sum'];
        })
        .reduce((accumulator, currentValue) => accumulator + currentValue);
    }
    return t;
  }
}
