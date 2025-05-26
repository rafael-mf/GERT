import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-fornecedores',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-fornecedores.component.html',
  styleUrl: './lista-fornecedores.component.scss'
})
export class Lista-fornecedoresComponent {}
