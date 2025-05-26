import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-relatorio-faturamento',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './relatorio-faturamento.component.html',
  styleUrl: './relatorio-faturamento.component.scss'
})
export class Relatorio-faturamentoComponent {}
