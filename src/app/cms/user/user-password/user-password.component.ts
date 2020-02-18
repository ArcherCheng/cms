import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { UserService } from 'src/app/service/user.service';
import { DataService } from 'src/app/service/data.service';
import { ValidationService } from 'src/app/shared/validation/validation.service';
import { Observable } from 'rxjs';
import { IData } from 'src/app/model/base';

export interface IPassword {
  old?: string;
  new?: string;
  repeat?: string;
}

@Component({
  // tslint:disable-next-line: component-selector
  selector: 'dialog-user-password',
  templateUrl: './user-password.component.html',
  styleUrls: ['./user-password.component.css']
})
export class DialogUserPasswordComponent implements OnInit {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogUserPasswordComponent>,
    private fb: FormBuilder,
    private userService: UserService,
    private dataService: DataService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    const obj = {
      oldP: [
        '',
        [Validators.required, Validators.minLength(6), ValidationService.userValidator],
        this.asyncValidator.bind(this)
      ],
      newP: ['', [Validators.required, Validators.minLength(6), ValidationService.userValidator]],
      repeatP: ['', [Validators.required, ValidationService.matchingPasswords('newP')]]
    };
    this.form = this.fb.group(obj);
  }

  getDetailData(): IPassword {
    return  {
      old: this.form.value.oldP,
      new: this.form.value.newP,
      repeat: this.form.value.repeatP
    } as IPassword;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onEnter() {
    this.dialogRef.close(this.getDetailData());
  }

  asyncValidator(control): Observable<IData> {
    // tslint:disable-next-line: deprecation
    return Observable.create(observer => {
      if (control.value === this.userService.getUser().password) {
        observer.next(null);
      } else {
        observer.next({ invalidOldPassword: true });
      }
      observer.complete();
    });
  }
}
