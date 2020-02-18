import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material';
import { SpinnerService, SpinnerState } from './spinner.service';

@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent implements OnInit, OnDestroy {
  visible = false;
  subscription: Subscription;

  constructor(private spinnerService: SpinnerService) {
    console.log('SpinnerComponent.constructor:');
    this.subscription = this.spinnerService.spinnerState.subscribe((state: SpinnerState) => {
      this.visible = state.show;
    });
  }

  ngOnInit() {
    console.log('SpinnerComponent.ngOnInit:');
  }

  ngOnDestroy() {
    console.log('SpinnerComponent.ngOnDestroy:');
    if (!!this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
