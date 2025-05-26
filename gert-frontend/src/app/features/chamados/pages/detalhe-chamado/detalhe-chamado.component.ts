import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalhe-chamado',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalhe-chamado.component.html',
  styleUrl: './detalhe-chamado.component.scss'
})
export class DetalheChamadoComponent {}
