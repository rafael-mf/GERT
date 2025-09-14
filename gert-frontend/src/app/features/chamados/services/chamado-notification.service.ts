import { Injectable } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Injectable({
  providedIn: 'root'
})
export class ChamadoNotificationService {
  constructor(private notificationService: NotificationService) {}

  notifyNewChamado(chamadoId: string, clienteNome: string): void {
    this.notificationService.addNotification({
      title: 'Novo Chamado Criado',
      message: `Chamado #${chamadoId} foi criado para o cliente ${clienteNome}`,
      type: 'info',
      icon: 'fas fa-ticket-alt'
    });
  }

  notifyChamadoConcluido(chamadoId: string): void {
    this.notificationService.addNotification({
      title: 'Chamado Concluído',
      message: `O chamado #${chamadoId} foi concluído com sucesso`,
      type: 'success',
      icon: 'fas fa-check-circle'
    });
  }

  notifyEstoqueBaixo(produtoNome: string, quantidade: number): void {
    this.notificationService.addNotification({
      title: 'Estoque Baixo',
      message: `O produto "${produtoNome}" está com estoque baixo (apenas ${quantidade} unidades)`,
      type: 'warning',
      icon: 'fas fa-exclamation-triangle'
    });
  }
}