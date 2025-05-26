import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-tecnico',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-tecnico.component.html',
  styleUrl: './lista-tecnico.component.scss'
})
export class ListaTecnicoComponent {}
