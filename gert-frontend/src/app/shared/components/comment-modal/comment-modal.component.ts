// gert-frontend/src/app/shared/components/comment-modal/comment-modal.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-comment-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal-header">
      <h5 class="modal-title">{{ title }}</h5>
      <button type="button" class="btn-close" aria-label="Close" (click)="activeModal.dismiss()"></button>
    </div>
    <div class="modal-body">
      <div class="mb-3">
        <label for="comment" class="form-label">{{ message }}</label>
        <textarea
          id="comment"
          class="form-control"
          [(ngModel)]="comment"
          rows="3"
          placeholder="Digite seu comentário aqui..."
          maxlength="500">
        </textarea>
        <div class="form-text">{{ comment.length }}/500 caracteres</div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-secondary" (click)="activeModal.dismiss()">
        {{ cancelText }}
      </button>
      <button type="button" class="btn btn-primary" (click)="activeModal.close(comment)" [disabled]="!comment.trim()">
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
      min-width: 80px;
    }
  `]
})
export class CommentModalComponent {
  activeModal = inject(NgbActiveModal);

  title = 'Adicionar Comentário';
  message = 'Comentário:';
  confirmText = 'Adicionar';
  cancelText = 'Cancelar';
  comment = '';
}