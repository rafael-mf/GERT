import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-novo-cliente',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './novo-cliente.component.html',
  styleUrl: './novo-cliente.component.scss'
})
export class NovoClienteComponent {}
