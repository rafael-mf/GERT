import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { RELATORIOS_ROUTES } from './relatorios.routes';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(RELATORIOS_ROUTES)
  ]
})
export class RelatoriosModule { }
