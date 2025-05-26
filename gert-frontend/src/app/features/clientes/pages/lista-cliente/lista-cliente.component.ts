import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-lista-cliente',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './lista-cliente.component.html',
  styleUrl: './lista-cliente.component.scss'
})
export class ListaClienteComponent {}
