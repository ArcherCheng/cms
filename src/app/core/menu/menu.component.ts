import { Component, OnInit } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { IMenu, Menu } from './menu';
import { LOGOURL, LANG, TOGGLELANG } from 'src/app/config';
import { CoreService } from '../core.service';
import { DataService } from 'src/app/service/data.service';
import { UserService } from 'src/app/service/user.service';
import { IPower, IHold } from 'src/app/model/data';
import { IData } from 'src/app/model/base';
import { ITabBase, ITabMain } from 'src/app/modules/tab/tabs';
import { TabService } from 'src/app/modules/tab/tab.service';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  LOGOURL = LOGOURL;
  LANG = LANG;
  TOGGLELANG = TOGGLELANG;
  menu: IMenu[] = Menu;
  isDevice = '';

  constructor(
    private coreService: CoreService,
    private breakpointObserver: BreakpointObserver,
    private tabService: TabService,
    private dataService: DataService,
    private userService: UserService
  ) {
    console.log('MenuComponent.constructor');
  }

  ngOnInit() {
    console.log('MenuComponent.ngOnInit');
    this.breakpointObserver.observe('(max-width: 1199px)').subscribe(res => {
      this.isDevice = res.matches ? 'mb' : 'pc';
      this.filterMenu();
    });
    this.setMenu();
  }

  setMenu() {
    console.log('MenuComponent.setMenu');
    this.dataService.getData('powers').subscribe((data: IData) => {
      if (!!data && !!data.res) {
        console.log('MenuComponent.setMenu', data);
        const powers = data.res as IPower[];
        powers.forEach((power: IPower) => {
          this.userService.getUser().holds.forEach((hold: IHold) => {
            if (hold.powerId === power.id) {
              const obj = {
                name: `${power.name}`,
                path: `/${power.name}`,
                check: false
              } as IMenu;
              this.menu.push(obj);
              // console.log(obj);
            }
          });
        });
        console.log('MenuComponent.setMenu', this.menu);
      }
    });
    this.filterMenu();
  }

  filterMenu() {
    console.log('MenuComponent.filterMenu');
    const index = this.menu
      .map(item => {
        return item.name;
      })
      .indexOf('user');
    if (this.isDevice === 'pc' && index !== -1) {
      this.menu.splice(index, 1);
    }
    if (this.isDevice === 'mb' && index === -1) {
      this.menu.splice(1, 0, {
        name: 'user',
        path: '/user',
        check: false
      });
    }
  }

  toggleMenuInfo(menuInfo: IMenu) {
    console.log('MenuComponent.toggleMenuInfo', menuInfo);
    menuInfo.check = !menuInfo.check;
    this.setListTab(menuInfo);
  }

  setListTab(menuInfo: IMenu) {
    console.log('MenuComponent.setListTab', menuInfo);
    this.coreService.nextHamburger('next');
    const tab = {
      tag: `${menuInfo.name}_list`,
      path: 'cms' + menuInfo.path
    } as ITabBase;
    const tabMain = {
      request: 'insert',
      content: tab
    } as ITabMain;
    this.tabService.nextTabMain(tabMain);
  }

  logout() {
    console.log('MenuComponent.logout');
    this.coreService.logout();
  }

  useLanguage($event?) {
    console.log('MenuComponent.useLanguage');
    if (!!$event) {
      this.coreService.useLanguage($event);
    }
  }

  getNowLang() {
    console.log('MenuComponent.getNowLang');
    return this.coreService.getNowLang();
  }
}
