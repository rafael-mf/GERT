import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-relatorio-financeiro',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './relatorio-financeiro.component.html',
  styleUrl: './relatorio-financeiro.component.scss'
})
export class RelatorioFinanceiroComponent {}
