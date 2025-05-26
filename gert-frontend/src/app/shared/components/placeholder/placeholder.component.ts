import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container-fluid">
      <div class="card">
        <div class="card-body text-center py-5">
          <h2>{{ title }}</h2>
          <p class="lead">{{ subtitle }}</p>
          <i class="fas fa-{{ icon }} fa-5x text-muted my-4"></i>
          <p>{{ message }}</p>
          <button *ngIf="backLink" class="btn btn-secondary mt-3" [routerLink]="backLink">
            <i class="fas fa-arrow-left me-2"></i>Voltar
          </button>
        </div>
      </div>
    </div>
  `
})
export class PlaceholderComponent {
  @Input() title = 'Funcionalidade em Desenvolvimento';
  @Input() subtitle = 'Esta funcionalidade será implementada em breve.';
  @Input() icon = 'cogs';
  @Input() message = 'Nossa equipe está trabalhando para disponibilizar esta seção o mais rápido possível.';
  @Input() backLink: string | null = null;
}
