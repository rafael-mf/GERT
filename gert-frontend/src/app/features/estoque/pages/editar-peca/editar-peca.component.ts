import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-editar-peca',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './editar-peca.component.html',
  styleUrl: './editar-peca.component.scss'
})
export class EditarPecaComponent {}
