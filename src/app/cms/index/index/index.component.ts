import { Component, OnInit, ChangeDetectorRef, AfterViewInit, HostListener, ChangeDetectionStrategy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndexComponent implements OnInit, AfterViewInit {
  innerWidth = 0;
  innerHeight = 0;
  isDevice = 'pc';

  constructor(
    private breakPointObserver: BreakpointObserver,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.breakPointObserver.observe('(max-width: 1199px)').subscribe(
      res => {
        this.isDevice = res.matches ? 'mb' : 'pc';
      }
    );
  }

  ngAfterViewInit() {
    setInterval(() => {
      this.changeDetectorRef.markForCheck();
    }, 1000);
    this.initSize();
  }

  @HostListener('window:resize', ['$event']) onResize(event: Event) {
    this.initSize();
  }

  initSize() {
    this.innerWidth = window.innerWidth;
    this.innerHeight = window.innerHeight;
    this.reviseSize();
  }

  reviseSize() {
    if (this.isDevice === 'pd') {
      this.innerWidth = this.innerWidth - 270;
      this.innerHeight = (this.innerHeight - 125) / 2 ;
    } else {
      this.innerWidth = this.innerWidth - 40;
      this.innerHeight = (this.innerHeight - 140) / 2 ;
    }
  }

}
