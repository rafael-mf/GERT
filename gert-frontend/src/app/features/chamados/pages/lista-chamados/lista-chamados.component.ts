import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-chamados',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-chamados.component.html',
  styleUrl: './lista-chamados.component.scss'
})
export class ListaChamadosComponent {}
