// gert-frontend/src/app/features/configuracoes/pages/configuracoes-home/configuracoes-home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-configuracoes-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './configuracoes-home.component.html',
  styleUrls: ['./configuracoes-home.component.scss']
})
export class ConfiguracoesHomeComponent {
  constructor() {
    console.log('ConfiguracoesHomeComponent: Construtor executado');
  }
}