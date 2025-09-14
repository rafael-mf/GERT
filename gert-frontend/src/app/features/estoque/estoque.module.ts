import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ESTOQUE_ROUTES } from './estoque.routes';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(ESTOQUE_ROUTES)
  ]
})
export class EstoqueModule { }
