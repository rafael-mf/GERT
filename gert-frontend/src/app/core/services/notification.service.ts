import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: Date;
  read: boolean;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private unreadCount = new BehaviorSubject<number>(0);

  constructor() {
    // Simulando algumas notificações iniciais
    const initialNotifications: Notification[] = [
      {
        id: '1',
        title: 'Chamado Criado',
        message: 'Novo chamado #001 foi criado para o cliente ABC Corp',
        type: 'info',
        timestamp: new Date(),
        read: false,
        icon: 'fas fa-ticket-alt'
      },
      {
        id: '2',
        title: 'Estoque Baixo',
        message: 'O produto "Cabo HDMI" está com estoque baixo (apenas 3 unidades)',
        type: 'warning',
        timestamp: new Date(Date.now() - 3600000), // 1 hora atrás
        read: false,
        icon: 'fas fa-exclamation-triangle'
      },
      {
        id: '3',
        title: 'Chamado Concluído',
        message: 'O chamado #099 foi concluído com sucesso',
        type: 'success',
        timestamp: new Date(Date.now() - 7200000), // 2 horas atrás
        read: true,
        icon: 'fas fa-check-circle'
      }
    ];
    
    this.notifications.next(initialNotifications);
    this.updateUnreadCount();
  }

  getNotifications(): Observable<Notification[]> {
    return this.notifications.asObservable();
  }

  getUnreadCount(): Observable<number> {
    return this.unreadCount.asObservable();
  }

  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>): void {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    };
    
    const current = this.notifications.value;
    this.notifications.next([newNotification, ...current]);
    this.updateUnreadCount();
  }

  markAsRead(id: string): void {
    const current = this.notifications.value;
    const updated = current.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    this.notifications.next(updated);
    this.updateUnreadCount();
  }

  markAllAsRead(): void {
    const current = this.notifications.value;
    const updated = current.map(n => ({ ...n, read: true }));
    this.notifications.next(updated);
    this.updateUnreadCount();
  }

  deleteNotification(id: string): void {
    const current = this.notifications.value;
    const updated = current.filter(n => n.id !== id);
    this.notifications.next(updated);
    this.updateUnreadCount();
  }

  private updateUnreadCount(): void {
    const unread = this.notifications.value.filter(n => !n.read).length;
    this.unreadCount.next(unread);
  }
}