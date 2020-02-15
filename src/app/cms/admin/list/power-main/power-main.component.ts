import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material';
import { AdminPowerComponent } from '../power/power.component';
import { IAdmin, IHold, IPower } from 'src/app/model/data';
import { DataService } from 'src/app/service/data.service';
import { IData } from 'src/app/model/base';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-admin-power-main',
  templateUrl: './power-main.component.html',
  styleUrls: ['./power-main.component.css']
})
export class AdminPowerMainComponent implements OnInit {
  @ViewChild(AdminPowerComponent, { static: false }) powerComp: AdminPowerComponent;
  // tslint:disable-next-line: no-inferrable-types
  @Input() adminId: number = 0;
  // tslint:disable-next-line: no-inferrable-types
  toggleUpdate: string = 'close-update';
  admin: IAdmin = null;

  constructor(public dialog: MatDialog, private dataService: DataService) {}

  ngOnInit() {
    if (!!this.adminId) {
      this.init();
    }
  }

  init() {
    this.dataService
      .getData('admins', this.adminId, [{ key: '_embed', val: 'holds' }])
      .subscribe((data: IData) => {
        if (!data.errorCode && !!data.res) {
          // tslint:disable-next-line: no-angle-bracket-type-assertion
          this.admin = <IAdmin> data.res;
        }
      });
  }

  onSave() {
    this.resetHold();
  }

  resetHold() {
    if (!!this.admin.holds && !!this.admin.holds.length) {
      this.runDelHold(0, this.admin.holds, []);
    } else {
      this.runInsertHolds(0, this.powerComp.getPowers(), []);
    }
  }

  runDelHold(index: number, holds: IHold[], errHolds: IHold[]) {
    const errHoldArr = errHolds;
    const length = holds.length;
    if (index < length) {
      this.delHold(index, holds, errHolds);
    } else {
      if (!!errHoldArr.length) {
        this.openStatusDialog(5);
      } else {
        this.runInsertHolds(0, this.powerComp.getPowers(), []);
      }
    }
  }

  delHold(index: number, holds: IHold[], errHolds: IHold[]) {
    this.dataService.deleteOne('holds', holds[index].id).subscribe((data: IData) => {
      if (!!data.errorCode) {
        errHolds.push(holds[index]);
      } else {
        this.runDelHold(++index, holds, errHolds);
      }
    });
  }


  runInsertHolds(index: number, powers: IPower[], errHolds: IPower[]) {
    const errHoldArr = errHolds;
    const length = powers.length;
    if (index < length) {
      this.insertHolds(index, powers, errHolds);
    } else {
      if (!!errHoldArr.length) {
        this.openStatusDialog(5);
      } else {
        this.toggleUpdate = 'close-update';
        this.init();
      }
    }
  }

  insertHolds(index: number, powers: IPower[], errHolds: IPower[]) {
    if (powers[index].check) {
      const obj: IHold = {
        adminId: this.adminId,
        powerId: powers[index].id
      };
      this.dataService.insertOne('holds', obj).subscribe((data: IData) => {
        if (!!data.errorCode) {
          errHolds.push(powers[index]);
        } else {
          this.runInsertHolds(++index, powers, errHolds);
        }
      });
    } else {
      this.runInsertHolds(++index, powers, errHolds);
    }
  }

  openStatusDialog(errorCode: number) {
    this.dialog.open(DialogComponent, {
      width: '250px',
      data: {
        // tslint:disable-next-line: object-literal-shorthand
        errorCode: errorCode
      }
    });
  }
}
