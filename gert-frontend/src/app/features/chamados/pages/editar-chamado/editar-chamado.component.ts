import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-editar-chamado',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './editar-chamado.component.html',
  styleUrl: './editar-chamado.component.scss'
})
export class EditarChamadoComponent {}
