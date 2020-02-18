import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ITabBase, ITabMain } from 'src/app/modules/tab/tabs';
import { IAdmin, IPower, IHold } from 'src/app/model/data';
import { Subscription, merge } from 'rxjs';
import { FormControl, Validators } from '@angular/forms';
import { ACCOUNTSTATUS, PAGESIZE, PAGESIZEOPTIONS } from 'src/app/config';
import { MatDialog } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/service/data.service';
import { UserService } from 'src/app/service/user.service';
import { TabService } from 'src/app/modules/tab/tab.service';
import { IPage, IData } from 'src/app/model/base';
import { fromEvent as observableFromEvent } from 'rxjs/internal/observable/fromEvent';
import { IDetailAdmin, DialogAdminInsertComponent } from './insert/dialog-insert.component';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { ChildToggle } from '../../child-toggle';
import { ClickToggle } from '../../click-toggle';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class AdminListComponent implements OnInit, AfterViewInit, OnDestroy  {
  ACCOUNTSTATUS = ACCOUNTSTATUS;
  PAGESIZEOPTIONS = PAGESIZEOPTIONS;
  isLoadingToggle = true;  // 讀取list的特效
  tab: ITabBase;           // 此頁面元素資料
  result: IAdmin[];        // 顯示在畫面的list array
  subscriptionClick: Subscription;
  childToggle = new ChildToggle('id', '', 0);
  clickToggle = new ClickToggle(0, '', ['change-status', 'change-name']);
  inputVal = new FormControl('', [Validators.required]);

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private dataService: DataService,
    private userService: UserService,
    private tabService: TabService
  ) { }

  ngOnInit() {
    this.route.data.subscribe(resolversData => {
      this.tab = resolversData.listTab;
      if (!!this.tab) {
        this.init();
      }
    });
  }

  ngOnDestroy() {
    if (!!this.subscriptionClick) {
      this.subscriptionClick.unsubscribe();
    }
  }

  ngAfterViewInit() {
    this.subscriptionClick = merge(
      observableFromEvent(document, 'click'),
      observableFromEvent(document, 'touchstart')
    ).subscribe((e: any) => {
      const isClick = this.clickToggle.atrTag.find(item => {
        if (!!e.srcElement.attributes.getNamedItem(item)) {
          const v = e.srcElement.attributes.getNamedItem(item);
          // tslint:disable-next-line: radix
          this.clickToggle.atrId = parseInt(v.nodeValue);
          this.clickToggle.atrTagSel = item;
          return true;
        }
      });
      if (!isClick) {
        if (!this.inputVal || !this.inputVal.valid) {
          this.clickReset();
          return;
        }
        // inputName exist
        if (!!this.inputVal && this.inputVal.valid) {
          this.saveClick(this.inputVal.value);
          this.clickReset();
        }
      }
    });
  }

  clickReset() {
    this.clickToggle.reset();
    this.inputVal.patchValue('');
  }

  saveClick(val: string) {
    switch (this.clickToggle.atrTagSel) {
      case 'change-status':
        this.saveStatus(this.clickToggle.atrId, val);
        break;
      case 'change-name':
        this.saveName(this.clickToggle.atrId, val);
        break;
    }
  }

  saveStatus(id: number, val: string) {
    this.dataService.updateOne('admins',  { status: +val } as IAdmin, id).subscribe((data: IData) => {
      if (!!data.errorCode) {
        this.openStatusDialog(data.errorCode);
      } else {
        this.setDatas();
      }
    });
  }

  saveName(id: number, val: string) {
    this.dataService.updateOne('admins', { name: val }, id).subscribe((data: IData) => {
      if (!!data.errorCode) {
        this.openStatusDialog(data.errorCode);
      } else {
        this.setDatas();
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
    this.setDatas(true);
  }

  /*換分頁 */
  onSetPage(pageObj: IPage) {
    this.tab.pageObj.pageIndex = pageObj.pageIndex;
    this.tab.pageObj.pageSize = pageObj.pageSize;
    this.setDatas();
  }

  /*裝畫面資料 */
  setDatas(isDataInit = false) {
    this.isLoadingToggle = true;
    this.dataService.getData('admins', null, null, this.tab.pageObj).subscribe((data: IData) => {
      this.isLoadingToggle = false;
      if (!!data.errorCode) {
        this.openStatusDialog(data.errorCode);
      } else {
        if (!!data.res) {
          this.result =  data.res as IAdmin[];
          this.setLoadingDatas(isDataInit);
        }
      }
    });
  }

  /*儲存storage */
  setLoadingDatas(isDataInit = false) {
    if (!isDataInit) {
      this.tabService.nextTabMain( {
        request: 'update',
        content: this.tab
      } as ITabMain);
    }
  }

  /*新增Admin的相關 Dialog Function */
  openInsertDialog() {
    this.childToggle.reset();
    const dialogRef = this.dialog.open(DialogAdminInsertComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe((o: IDetailAdmin) => {
      if (!!o && !!o.admin) {
        o.admin.token = this.dataService.makeToken(o.admin.account);
        o.admin =  this.dataService.checkData(o.admin, this.userService.getUser().id) as IAdmin;
        this.dataService.insertOne('admins', o.admin).subscribe((data: IData) => {
          if (!!data.errorCode) {
            this.openStatusDialog(data.errorCode);
          } else {
            const admin =  data.res as IAdmin;
            this.runHolds(0, o.powers, admin);
          }
        });
      }
    });
  }

  runHolds(index: number, powers: IPower[], admin: IAdmin) {
    const length = powers.length;
    if (index < length) {
      this.insertHolds(index, powers, admin);
    } else {
      this.openStatusDialog(0);
      this.setDatas();
    }
  }

  insertHolds(index: number, powers: IPower[], admin: IAdmin) {
    const obj =  {
      adminId: admin.id,
      powerId: powers[index].id
    } as IHold;
    this.dataService.insertOne('holds', obj).subscribe(() => {
      this.runHolds(++index, powers, admin);
    });
  }

  /*開子組件 */
  onOpenChild(action: string, select: IAdmin) {
    if (!!this.childToggle && !!select) {
      if (
        // tslint:disable-next-line: triple-equals
        select[this.childToggle.selectMarkID] == this.childToggle.selectId &&
        // tslint:disable-next-line: triple-equals
        action == this.childToggle.selectTag
      ) {
        this.childToggle.reset();
        return;
      }
      this.childToggle.setData(action, select[this.childToggle.selectMarkID]);
    }
  }

  /*打開 alert-dialog 提示視窗 */
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
