import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-peca',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-peca.component.html',
  styleUrl: './lista-peca.component.scss'
})
export class ListaPecaComponent {}
