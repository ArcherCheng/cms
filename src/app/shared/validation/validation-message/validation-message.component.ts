import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-validation-message',
  templateUrl: './validation-message.component.html',
  styleUrls: ['./validation-message.component.css']
})
export class ValidationMessageComponent implements OnInit {
  @Input() control: FormControl;

  constructor() { }

  ngOnInit() {
  }

  get errorMessage() {
    if (!!this.control) {
      for (const propertyName in this.control.errors) {
        if (this.control.errors.hasOwnProperty(propertyName) && this.control.touched) {
          return propertyName;
        }
      }
    }
    return null;
  }

}
