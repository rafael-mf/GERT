import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalhe-tecnico',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalhe-tecnico.component.html',
  styleUrl: './detalhe-tecnico.component.scss'
})
export class DetalheTecnicoComponent {}
