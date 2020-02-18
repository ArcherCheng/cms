import { Component, OnInit, Inject } from '@angular/core';
import { IOrder, IOrderCar, ICustomer, IProduct } from 'src/app/model/data';
import { FormGroup, FormBuilder, Validators, FormArray, ValidationErrors } from '@angular/forms';
import { ORDERSTATUS, ErrorCodeMsg } from 'src/app/config';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DataService, IFilter } from 'src/app/service/data.service';
import { ValidationService } from 'src/app/shared/validation/validation.service';
import { IData } from 'src/app/model/base';

export interface IDetailOrder {
  order: IOrder;
  oldCars: IOrderCar[];
  cars: IOrderCar[];
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dialog-order-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DialogOrderDetailComponent implements OnInit {
  ORDERSTATUS = ORDERSTATUS;
  form: FormGroup;
  customerName = '';
  cars: IOrderCar[] = [];

  constructor(
    public dialogRef: MatDialogRef<DialogOrderDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDetailOrder,
    private fb: FormBuilder,
    private dataService: DataService
  ) {}

  ngOnInit() {
    if (!!this.data) {
      this.createForm();
      if (!!this.data.order) {
        this.editForm();
      }
    }
  }

  createForm() {
    const obj = {
      customerId: ['', [Validators.required, ValidationService.numberOnlyValidator]],
      status: ['', [Validators.required, ValidationService.numberOnlyValidator]],
      arrs: this.fb.array([], Validators.required)
    };
    this.form = this.fb.group(obj);
  }

  editForm() {
    const order = this.data.order;
    this.form.patchValue({
      customerId: order.customerId.toString() || '',
      status: order.status.toString() || ''
    });
    this.setCustomerName(order.customerId.toString());
    this.setCars();
  }

  get arrs(): FormArray {
    return this.form.get('arrs') as FormArray;
  }

  setCustomerName(customerId: string) {
    this.customerName = '';
    if (!!+customerId) {
      this.dataService.getData('customers', +customerId).subscribe((data: IData) => {
        if (!data.errorCode && !!data.res) {
          const customer =  data.res as ICustomer;
          this.customerName = customer.name;
        } else {
          const result = ErrorCodeMsg.filter(item => item.code === 8);
          const msg = result[0].name;
          const o =  {} as ValidationErrors;
          o[msg] = true;
          // tslint:disable-next-line: no-string-literal
          this.form.controls['customerId'].setErrors(o);
        }
      });
    }
  }

  setCars() {
    const filters: IFilter[] = [
      { key: 'orderId', val: this.data.order.id },
      { key: '_expand', val: 'product' }
    ];
    this.dataService.getData('cars', null, filters).subscribe((data: IData) => {
      const carsArr =  data.res as IOrderCar[];
      this.data.oldCars = carsArr.slice(0);
      this.cars = carsArr;
      this.setArrs();
    });
  }

  setArrs() {
    if (!!this.cars && !!this.cars.length) {
      this.cars.forEach((car: IOrderCar, index: number) => {
        this.arrs.push(
          this.fb.group({
            productId: [
              car.productId.toString(),
              [Validators.required, ValidationService.numberOnlyValidator]
            ],
            amount: [
              car.amount.toString(),
              [Validators.required, ValidationService.numberOnlyValidator]
            ]
          })
        );
      });
    }
  }

  setProductData(index: number, productId: string) {
    if (!!+productId) {
      this.dataService.getData('products', +productId).subscribe((data: IData) => {
        if (!data.errorCode && !!data.res) {
          const product =  data.res as IProduct;
          this.cars[index].product = product;
          this.cars[index].productId = product.id;
        } else {
          const result = ErrorCodeMsg.filter(item => item.code === 9);
          const msg = result[0].name;
          const o =  {} as ValidationErrors;
          o[msg] = true;
          const control = ( this.form.controls.arrs as FormArray).controls;
          // tslint:disable-next-line: no-string-literal
          control[index]['controls']['productId'].setErrors(o);
          this.resetProduct(index);
        }
      });
    } else {
      this.resetProduct(index);
    }
  }

  resetProduct(index: number) {
    this.cars[index].product =  {
      id: 0,
      typeId: 0,
      name: '',
      price: 0,
      file: ''
    } as IProduct;
    this.cars[index].productId = 0;
  }

  addArr() {
    this.arrs.push(
      this.fb.group({
        productId: ['', [Validators.required, ValidationService.numberOnlyValidator]],
        amount: ['', [Validators.required, ValidationService.numberOnlyValidator]]
      })
    );
    this.cars.push( {
      id: 0,
      orderId: 0,
      amount: 0,
      productId: 0,
      product: {}
    } as IOrderCar);
  }

  delArr(index: number) {
    this.arrs.removeAt(index);
    this.cars.splice(index, 1);
  }

  turnArrs() {
    if (!!this.form.value.arrs && !!this.form.value.arrs.length) {
      this.form.value.arrs.forEach((item: IOrderCar) => {
        item.productId = +item.productId;
        item.amount = +item.amount;
      });
    }
  }

  getDetailData(): IDetailOrder {
    const order =  {
      customerId: +this.form.value.customerId,
      status: +this.form.value.status
    } as IOrder;
    this.turnArrs();
    return  {
      order,
      cars: this.form.value.arrs,
      oldCars: this.data.oldCars
    } as IDetailOrder;
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

  onNoClick(): void {
    this.dialogRef.close();
  }

  onEnter() {
    this.dialogRef.close(this.getDetailData());
  }
}
