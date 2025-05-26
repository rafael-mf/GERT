import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-relatorio-estoque',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './relatorio-estoque.component.html',
  styleUrl: './relatorio-estoque.component.scss'
})
export class RelatorioEstoqueComponent {}
