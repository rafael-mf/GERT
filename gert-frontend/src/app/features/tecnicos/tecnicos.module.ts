import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TECNICOS_ROUTES } from './tecnicos.routes';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(TECNICOS_ROUTES)
  ]
})
export class TecnicosModule { }
