import { Component, OnInit, OnDestroy } from '@angular/core';
import { COPYRIGHT, LANG, TOGGLELANG } from 'src/app/config';
import { Subscription } from 'rxjs';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { CoreService } from '../core.service';
import { UserService } from 'src/app/service/user.service';
import { TabService } from 'src/app/modules/tab/tab.service';
import { DataService } from 'src/app/service/data.service';
import { ITabMain, ITabBase } from 'src/app/modules/tab/tabs';
import { SlideInOutAnimation } from './animations';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.css'],
  animations: [SlideInOutAnimation]
})
export class CoreComponent implements OnInit, OnDestroy {
  COPYRIGHT = COPYRIGHT;
  LANG = LANG;
  TOGGLELANG = TOGGLELANG;
  subscription: Subscription;
  animationState = 'in';
  isHamburger = false;
  isDevice = '';

  constructor(
    private breakpointObserver: BreakpointObserver,
    private router: Router,
    public service: CoreService,
    private userService: UserService,
    private tabService: TabService,
    protected dataService: DataService
  ) {
    console.log('CoreComponent.constructor');
  }

  ngOnInit() {
    console.log('CoreComponent.ngOnInit');
    if (!!this.service.isHamburgerIn()) {
      this.subscription = this.service.isHamburgerIn().subscribe(val => {
        if (this.isDevice === 'mb') {
          this.isHamburger = val !== '';
          this.toggleMenu();
        }
      });
    }

    this.breakpointObserver.observe('(max-width: 1199px)').subscribe(r => {
      this.isHamburger = r.matches;
      this.isDevice = r.matches ? 'mb' : 'pc';
      this.toggleMenu();
    });

    this.goHome();
  }

  ngOnDestroy() {
    console.log('CoreComponent.ngOnDestroy');
    if (!!this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  toggle() {
    console.log('CoreComponent.toggle');
    this.isHamburger = !this.isHamburger;
    this.toggleMenu();
  }

  toggleMenu() {
    console.log('CoreComponent.toggleMenu');
    this.animationState = this.isHamburger ? 'out' : 'in';
  }

  useLanguage($event) {
    console.log('CoreComponent.useLanguage');
    if (!!$event) {
      this.service.useLanguage($event);
    }
  }

  getUserAccount(): string {
    console.log('CoreComponent.getUserAccount');
    if (!!this.userService.getUser() && !!this.userService.getUser().account) {
      return this.userService.getUser().account;
    }
  }

  nextUser() {
    console.log('CoreComponent.nextUser');
    const tab = {
      tag: `user_list`,
      path: `cms/user`
    } as ITabBase;
    const tabMain = {
      request: 'insert',
      content: tab
    } as ITabMain;
    this.tabService.nextTabMain(tabMain);
  }

  goHome() {
    console.log('CoreComponent.goHome');
    this.router.navigate(['cms/index/', { tag: '' }], {
      skipLocationChange: true,
      queryParamsHandling: 'merge'
    });
  }
}

