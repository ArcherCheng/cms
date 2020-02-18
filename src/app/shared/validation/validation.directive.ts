import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALIDATORS, AbstractControl } from '@angular/forms';
import { ValidationService } from './validation.service';

@Directive({
  // tslint:disable-next-line: directive-selector
  selector: '[fnValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ValidationDirective),
      multi: true
    }
  ]
})
export class ValidationDirective {
  @Input() fnValidator: string;
  validate(c: AbstractControl): { [key: string]: any } {
    return ValidationService[this.fnValidator](c);
  }
  constructor() { }

}
