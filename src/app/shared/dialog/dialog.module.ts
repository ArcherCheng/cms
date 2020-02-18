import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogComponent } from './dialog.component';
import { MatInputModule, MatDialogModule, MatIconModule } from '@angular/material';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ValidationModule } from '../validation/validation.module';

@NgModule({
  declarations: [DialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatIconModule,
    MatDialogModule,
    MatInputModule,
    ValidationModule
  ],
  exports: [ DialogComponent ],
  entryComponents: [ DialogComponent ]
})
export class DialogModule { }
