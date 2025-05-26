import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-detalhe-cliente',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalhe-cliente.component.html',
  styleUrl: './detalhe-cliente.component.scss'
})
export class DetalheClienteComponent {}
