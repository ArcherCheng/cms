import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from './material/material.module';
import { DialogModule } from './dialog/dialog.module';
import { PipeModule } from './pipe/pipe.module';
import { ValidationModule } from './validation/validation.module';
import { LoadingModule } from './loading/loading.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule,
    MaterialModule,
    PipeModule,
    ValidationModule,
    LoadingModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    DialogModule,
    MaterialModule,
    PipeModule,
    ValidationModule,
    LoadingModule,
  ]
})
export class SharedModule { }
