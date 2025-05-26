import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-pecas',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-pecas.component.html',
  styleUrl: './lista-pecas.component.scss'
})
export class Lista-pecasComponent {}
