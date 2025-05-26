import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-editar-tecnico',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './editar-tecnico.component.html',
  styleUrl: './editar-tecnico.component.scss'
})
export class EditarTecnicoComponent {}
