// gert-frontend/src/app/shared/components/confirm-modal/confirm-modal.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">{{ title }}</h5>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <p>{{ message }}</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">
        {{ cancelText }}
      </button>
      <button type="button" class="btn btn-{{ confirmClass }}" (click)="activeModal.close(true)">
        {{ confirmText }}
      </button>
    </div>
  `,
  styles: [`
    .modal-header {
      border-bottom: 1px solid #dee2e6;
      padding: 1rem;
    }

    .modal-title {
      font-weight: 600;
      color: #495057;
    }

    .modal-body {
      padding: 1rem;
    }

    .modal-footer {
      border-top: 1px solid #dee2e6;
      padding: 1rem;
      display: flex;
      justify-content: flex-end;
      gap: 0.5rem;
    }

    .btn {
      border-radius: 0.375rem;
      font-weight: 500;
      padding: 0.5rem 1rem;
      min-width: 80px;
    }

    .btn-secondary {
      background-color: #6c757d;
      border-color: #6c757d;
      color: white;

      &:hover {
        background-color: #5c636a;
        border-color: #565e64;
      }
    }

    .btn-danger {
      background-color: #dc3545;
      border-color: #dc3545;
      color: white;

      &:hover {
        background-color: #bb2d3b;
        border-color: #b02a37;
      }
    }

    .btn-primary {
      background-color: #0d6efd;
      border-color: #0d6efd;
      color: white;

      &:hover {
        background-color: #0b5ed7;
        border-color: #0a58ca;
      }
    }

    .btn-close {
      background: none;
      border: none;
      font-size: 1.25rem;
      opacity: 0.5;
      cursor: pointer;

      &:hover {
        opacity: 0.75;
      }
    }
  `]
})
export class ConfirmModalComponent {
  activeModal = inject(NgbActiveModal);

  title = 'Confirmar Ação';
  message = 'Tem certeza que deseja continuar?';
  confirmText = 'Confirmar';
  cancelText = 'Cancelar';
  confirmClass = 'primary';
}