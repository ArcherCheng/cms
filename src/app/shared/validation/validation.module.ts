import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ValidationDirective } from './validation.directive';
import { ValidationMessageComponent } from './validation-message/validation-message.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ValidationService } from './validation.service';

@NgModule({
  declarations: [ValidationDirective, ValidationMessageComponent],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule
  ],
  exports: [ValidationDirective, ValidationMessageComponent],
  providers: [ValidationService],
})
export class ValidationModule { }
