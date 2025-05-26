import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-relatorio-tecnicos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './relatorio-tecnicos.component.html',
  styleUrl: './relatorio-tecnicos.component.scss'
})
export class RelatorioTecnicosComponent {}
