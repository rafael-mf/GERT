import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-tecnicos',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-tecnicos.component.html',
  styleUrl: './lista-tecnicos.component.scss'
})
export class Lista-tecnicosComponent {}
