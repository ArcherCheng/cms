import { Component, OnInit, Inject } from '@angular/core';
import { IProduct, IType } from 'src/app/model/data';
import { PRODUCTSTATUS } from 'src/app/config';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ValidationService } from 'src/app/shared/validation/validation.service';

export interface IDetailProduct {
  product: IProduct;
  types: IType[];
}

@Component({
  selector: 'app-product-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DialogProductDetailComponent implements OnInit {
  PRODUCTSTATUS = PRODUCTSTATUS;
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogProductDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IDetailProduct,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    if (!!this.data && !!this.data.types) {
      this.createForm();
      if (!!this.data.product) {
        this.editForm();
      }
    }
  }

  createForm() {
    const obj = {
      name: ['', [Validators.required]],
      price: ['', [Validators.required, ValidationService.integerValidator]],
      typeId: ['', [Validators.required, ValidationService.numberOnlyValidator]],
      status: ['', [Validators.required]],
      file: ['', [Validators.required]]
    };
    this.form = this.fb.group(obj);
  }

  editForm() {
    const product = this.data.product;
    this.form.patchValue({
      name: product.name || '',
      price: product.price.toString() || '',
      typeId: product.typeId.toString() || '',
      status: product.status.toString() || '',
      file: product.file || ''
    });
  }

  getDetailData(): IProduct {
    return  {
      name: this.form.value.name,
      price: +this.form.value.price,
      typeId: +this.form.value.typeId,
      status: +this.form.value.status,
      file: this.form.value.file
    } as IProduct;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onEnter() {
    this.dialogRef.close(this.getDetailData());
  }
}
