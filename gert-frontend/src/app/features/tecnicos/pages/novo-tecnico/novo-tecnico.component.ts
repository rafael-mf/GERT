import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-novo-tecnico',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './novo-tecnico.component.html',
  styleUrl: './novo-tecnico.component.scss'
})
export class NovoTecnicoComponent {}
