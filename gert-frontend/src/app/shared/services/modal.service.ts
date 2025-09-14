// gert-frontend/src/app/shared/services/modal.service.ts
import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../components/confirm-modal/confirm-modal.component';
import { CommentModalComponent } from '../components/comment-modal/comment-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private modalService: NgbModal) { }

  /**
   * Exibe um modal de confirmação personalizado
   * @param options Configurações do modal
   * @returns Promise<boolean> - true se confirmado, false se cancelado
   */
  confirm(options: {
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmClass?: 'primary' | 'danger' | 'warning';
  }): Promise<boolean> {
    const modalRef = this.modalService.open(ConfirmModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    const component = modalRef.componentInstance as ConfirmModalComponent;
    component.title = options.title || 'Confirmar Ação';
    component.message = options.message;
    component.confirmText = options.confirmText || 'Confirmar';
    component.cancelText = options.cancelText || 'Cancelar';
    component.confirmClass = options.confirmClass || 'primary';

    return modalRef.result
      .then(() => true)
      .catch(() => false);
  }

  /**
   * Exibe modal de confirmação para exclusão
   * @param itemName Nome do item a ser excluído
   * @returns Promise<boolean>
   */
  confirmDelete(itemName: string): Promise<boolean> {
    return this.confirm({
      title: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir "${itemName}"? Esta ação não pode ser desfeita.`,
      confirmText: 'Excluir',
      cancelText: 'Cancelar',
      confirmClass: 'danger'
    });
  }

  /**
   * Exibe modal de confirmação para fechamento de chamado
   * @returns Promise<boolean>
   */
  confirmCloseChamado(): Promise<boolean> {
    return this.confirm({
      title: 'Fechar Chamado',
      message: 'Tem certeza que deseja fechar este chamado? Esta ação não pode ser desfeita.',
      confirmText: 'Fechar Chamado',
      cancelText: 'Cancelar',
      confirmClass: 'danger'
    });
  }

  /**
   * Exibe modal para adicionar comentário
   * @returns Promise<string> - o comentário digitado ou vazio se cancelado
   */
  addComment(): Promise<string> {
    const modalRef = this.modalService.open(CommentModalComponent, {
      centered: true,
      backdrop: 'static',
      keyboard: false
    });

    return modalRef.result
      .then((comment: string) => comment || '')
      .catch(() => '');
  }
}