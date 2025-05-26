import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalhe-peca',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalhe-peca.component.html',
  styleUrl: './detalhe-peca.component.scss'
})
export class DetalhePecaComponent {}
