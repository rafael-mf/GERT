import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-novo-chamado',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './novo-chamado.component.html',
  styleUrl: './novo-chamado.component.scss'
})
export class NovoChamadoComponent {}
