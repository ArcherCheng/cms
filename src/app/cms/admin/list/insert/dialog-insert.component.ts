import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { IAdmin, IPower } from 'src/app/model/data';
import { AdminPowerComponent } from '../power/power.component';
import { ValidationService } from 'src/app/shared/validation/validation.service';

export interface IDetailAdmin {
  admin: IAdmin;
  powers: IPower[];
}

@Component({
  selector: 'app-dialog-admin-insert',
  templateUrl: './dialog-insert.component.html',
  styleUrls: ['./dialog-insert.component.css']
})
export class DialogAdminInsertComponent implements OnInit {
  @ViewChild(AdminPowerComponent, { static: false }) powerComp: AdminPowerComponent;
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogAdminInsertComponent>,
    private fb: FormBuilder
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    const obj = {
      account: [
        '',
        [Validators.required, Validators.minLength(6), ValidationService.userValidator]
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(6), ValidationService.userValidator]
      ],
      name: ['', Validators.required]
    };
    this.form = this.fb.group(obj);
  }

  getDetailData(): IDetailAdmin {
    const powers: IPower[] = [];
    this.powerComp.getPowers().forEach((power: IPower) => {
      if (power.check) {
        powers.push(power);
      }
    });
    const admin =  {
      account: this.form.value.account,
      password: this.form.value.password,
      name: this.form.value.name,
      status: 1
    } as IAdmin;
    return  {
      admin,
      powers
    } as IDetailAdmin;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onEnter() {
    this.dialogRef.close(this.getDetailData());
  }
}
