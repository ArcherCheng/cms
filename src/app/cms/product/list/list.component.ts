import { Component, OnInit } from '@angular/core';
import { PRODUCTSTATUS, PAGESIZE, PAGESIZEOPTIONS } from 'src/app/config';
import { ITabBase, ITabMain } from 'src/app/modules/tab/tabs';
import { IProduct, IType } from 'src/app/model/data';
import { MatDialog } from '@angular/material';
import { DataService, IFilter } from 'src/app/service/data.service';
import { ActivatedRoute } from '@angular/router';
import { TabService } from 'src/app/modules/tab/tab.service';
import { UserService } from 'src/app/service/user.service';
import { IPage, IData } from 'src/app/model/base';
import { Search } from 'src/app/modules/search/search';
import { IDetailProduct, DialogProductDetailComponent } from './detail/detail.component';
import { DialogProductTypeComponent } from '../dialog-type/dialog-type.component';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';

@Component({
  selector: 'app-product-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ProductListComponent implements OnInit {
  PRODUCTSTATUS = PRODUCTSTATUS;
  PAGESIZEOPTIONS =  PAGESIZEOPTIONS;
  isLoadingToggle = true;
  tab: ITabBase;
  result: IProduct[] = [];
  types: IType[] = [];

  constructor(
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private dataService: DataService,
    private userService: UserService,
    private tabService: TabService
  ) {}

  ngOnInit() {
    this.route.data.subscribe(resolversData => {
      this.tab = resolversData.listTab;
      if (!!this.tab) {
        this.init();
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
    if (!this.tab.searchObj) {
      this.tab.searchObj = new Search();
      this.tab.searchObj.expand = 'type';
    } else {
      this.tab.searchObj = Object.assign(new Search(), this.tab.searchObj);
    }
    this.setDatas(true);
    this.setTypes();
  }

  /*換分頁 */
  onSetPage(pageObj: IPage) {
    this.tab.pageObj.pageIndex = pageObj.pageIndex;
    this.tab.pageObj.pageSize = pageObj.pageSize;
    this.setDatas();
  }

  /*搜尋 */
  onSearch() {
    this.tab.pageObj.pageIndex = 0;
    this.setDatas();
  }

  setDatas(isDataInit = false) {
    this.isLoadingToggle = true;
    this.dataService
      .getData('products', null, this.setFilters(), this.tab.pageObj)
      .subscribe((data: IData) => {
        this.isLoadingToggle = false;
        if (!!data.errorCode) {
          this.openStatusDialog(data.errorCode);
        } else {
          if (!!data.res) {
            this.result =  data.res as IProduct[];
            this.setLoadingDatas(isDataInit);
          }
        }
      });
  }

  setLoadingDatas(isDataInit = false) {
    if (!isDataInit) {
      this.tabService.nextTabMain( {
        request: 'update',
        content: this.tab
      } as ITabMain);
    }
  }

  setFilters(): IFilter[] {
    const f: IFilter[] = [];
    const s = this.tab.searchObj.getSearch();
    const keys = Object.keys(s);
    keys.forEach((item: string) => {
      f.push({
        key: item,
        val: s[item]
      });
    });
    return f;
  }

  setTypes() {
    this.dataService.getData('types').subscribe((data: IData) => {
      if (!!data.errorCode) {
        this.openStatusDialog(data.errorCode);
      } else {
        if (!!data.res) {
          this.types =  data.res as IType[];
        }
      }
    });
  }

  /*開Dialog */
  openDialog(action: string, select?: IProduct) {
    switch (action) {
      case 'insert':
        this.openDetailDialog();
        break;
      case 'update':
        this.openDetailDialog(select);
        break;
      case 'type':
        this.openTypeDialog();
        break;
    }
  }

  openDetailDialog(select?: IProduct) {
    if (!!this.types && !!this.types.length) {
      const obj =  {
        product: null,
        types: this.types
      } as IDetailProduct;
      if (!!select) {
        obj.product = select;
      }
      const dialogRef = this.dialog.open(DialogProductDetailComponent, {
        width: '600px',
        data: obj
      });
      dialogRef.afterClosed().subscribe((o: IProduct) => {
        if (!!o) {
          if (!select) {
            this.insertProduct(o);
          } else {
            this.updateProduct(o, select);
          }
        }
      });
    }
  }

  insertProduct(o: IProduct) {
    o =  this.dataService.checkData(o, this.userService.getUser().id) as IProduct;
    this.dataService.insertOne('products', o).subscribe((data: IData) => {
      this.openStatusDialog(data.errorCode);
    });
  }

  updateProduct(o: IProduct, select: IProduct) {
    o =  this.dataService.checkData(o, this.userService.getUser().id, false) as IProduct;
    this.dataService.updateOne('products', o, select.id).subscribe((data: IData) => {
      this.openStatusDialog(data.errorCode);
    });
  }

  openTypeDialog() {
    if (!!this.types && !!this.types.length) {
      const obj = {
        typeNames: this.types.map((type: IType) => {
          return type.name;
        })
      };
      const dialogRef = this.dialog.open(DialogProductTypeComponent, {
        width: '600px',
        data: obj
      });

      dialogRef.afterClosed().subscribe((typeNames: string[]) => {
        if (!!typeNames && !!typeNames.length) {
          this.runAction(0, typeNames);
        }
      });
    }
  }

  runAction(index: number, typeNames: string[]) {
    const length = typeNames.length;
    const oldLength = this.types.length;
    if (index < oldLength) {
      this.updateTypeNames(index, typeNames);
    } else {
      if (index < length) {
        this.insertTypeNames(index, typeNames);
      } else {
        this.setTypes();
        this.openStatusDialog(0);
      }
    }
  }

  updateTypeNames(index: number, typeNames: string[]) {
    this.dataService.updateOne('types', { name: typeNames[index] }, index + 1).subscribe(() => {
      this.runAction(++index, typeNames);
    });
  }

  insertTypeNames(index: number, typeNames: string[]) {
    this.dataService.insertOne('types',  { name: typeNames[index] } as IType).subscribe(() => {
      this.runAction(++index, typeNames);
    });
  }

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
