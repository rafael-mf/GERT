import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-relatorio-chamados',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './relatorio-chamados.component.html',
  styleUrl: './relatorio-chamados.component.scss'
})
export class RelatorioChamadosComponent {}
