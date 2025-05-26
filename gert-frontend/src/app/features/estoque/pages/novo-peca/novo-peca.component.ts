import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-novo-peca',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './novo-peca.component.html',
  styleUrl: './novo-peca.component.scss'
})
export class NovoPecaComponent {}
