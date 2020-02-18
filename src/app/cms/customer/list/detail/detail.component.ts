import { Component, OnInit, Inject } from '@angular/core';
import { ICustomer, ILevel } from 'src/app/model/data';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ACCOUNTSTATUS } from 'src/app/config';
import { ValidationService } from 'src/app/shared/validation/validation.service';

export interface IDetailCustomer {
  customer: ICustomer;
  levels: ILevel[];
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dialog-customer-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})

export class DialogCustomerDetailComponent implements OnInit {
  ACCOUNTSTATUS = ACCOUNTSTATUS;
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogCustomerDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDetailCustomer,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    if (!!this.data && !!this.data.levels) {
      this.createForm();
      if (!!this.data.customer) {
        this.editForm();
      }
    }
  }

  createForm() {
    const obj = {
      name: ['', Validators.required],
      levelId: ['', Validators.required],
      status: ['', Validators.required]
    };
    if (!this.data.customer) {
      // insert
      // tslint:disable-next-line: no-string-literal
      obj['account'] = [
        '',
        [Validators.required, Validators.minLength(6), ValidationService.userValidator]
      ];
      // tslint:disable-next-line: no-string-literal
      obj['password'] = [
        '',
        [Validators.required, Validators.minLength(6), ValidationService.userValidator]
      ];
    }
    this.form = this.fb.group(obj);
  }

  editForm() {
    const customer = this.data.customer;
    this.form.setValue({
      name: customer.name || '',
      levelId: customer.levelId.toString() || '',
      status: customer.status.toString() || ''
    });
  }

  getDetailData(): ICustomer {
    return  {
      account: this.form.value.account,
      password: this.form.value.password,
      name: this.form.value.name,
      levelId: +this.form.value.levelId,
      status: +this.form.value.status
    } as ICustomer;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onEnter() {
    this.dialogRef.close(this.getDetailData());
  }
}
