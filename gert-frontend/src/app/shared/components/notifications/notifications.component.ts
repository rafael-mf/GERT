import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService, Notification } from '../../../core/services/notification.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, NgbDropdownModule],
  template: `
    <div class="dropdown" ngbDropdown>
      <button 
        class="btn btn-sm btn-outline-primary position-relative" 
        type="button" 
        ngbDropdownToggle
        id="notificationsDropdown">
        <i class="fas fa-bell"></i>
        <span 
          *ngIf="(unreadCount$ | async) as unreadCount" 
          class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
          [class.d-none]="unreadCount === 0">
          {{unreadCount}}
        </span>
      </button>
      
      <div class="dropdown-menu dropdown-menu-end notification-dropdown" ngbDropdownMenu>
        <div class="dropdown-header d-flex justify-content-between align-items-center">
          <h6 class="mb-0">Notificações</h6>
          <button 
            class="btn btn-sm btn-link p-0" 
            (click)="markAllAsRead()"
            *ngIf="(unreadCount$ | async)! > 0">
            <small>Marcar todas como lidas</small>
          </button>
        </div>
        
        <div class="notification-list" style="max-height: 400px; overflow-y: auto;">
          <div 
            *ngFor="let notification of (notifications$ | async); trackBy: trackByNotificationId" 
            class="dropdown-item-text notification-item"
            [class.unread]="!notification.read"
            (click)="markAsRead(notification.id)">
            
            <div class="d-flex align-items-start">
              <div class="notification-icon me-2">
                <i [class]="notification.icon || 'fas fa-info-circle'" 
                   [class.text-info]="notification.type === 'info'"
                   [class.text-success]="notification.type === 'success'"
                   [class.text-warning]="notification.type === 'warning'"
                   [class.text-danger]="notification.type === 'error'"></i>
              </div>
              
              <div class="notification-content flex-grow-1">
                <div class="notification-title fw-semibold">{{notification.title}}</div>
                <div class="notification-message text-muted small">{{notification.message}}</div>
                <div class="notification-time text-muted" style="font-size: 0.75rem;">
                  {{getTimeAgo(notification.timestamp)}}
                </div>
              </div>
              
              <button 
                class="btn btn-sm btn-outline-danger ms-2" 
                (click)="deleteNotification(notification.id); $event.stopPropagation()"
                title="Excluir notificação">
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          
          <div *ngIf="(notifications$ | async)?.length === 0" class="text-center p-3 text-muted">
            <i class="fas fa-bell-slash mb-2"></i>
            <div>Nenhuma notificação</div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notification-dropdown {
      width: 350px;
    }
    
    .notification-item {
      border-bottom: 1px solid #eee;
      padding: 12px 16px;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .notification-item:hover {
      background-color: #f8f9fa;
    }
    
    .notification-item.unread {
      background-color: #e3f2fd;
      border-left: 4px solid #2196f3;
    }
    
    .notification-item:last-child {
      border-bottom: none;
    }
    
    .notification-title {
      color: #333;
    }
    
    .notification-message {
      font-size: 0.875rem;
      line-height: 1.3;
      margin-top: 2px;
    }
    
    .notification-time {
      margin-top: 4px;
    }
    
    .notification-icon {
      width: 20px;
      text-align: center;
      margin-top: 2px;
    }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications$!: Observable<Notification[]>;
  unreadCount$!: Observable<number>;

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.notifications$ = this.notificationService.getNotifications();
    this.unreadCount$ = this.notificationService.getUnreadCount();
  }

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  deleteNotification(id: string): void {
    this.notificationService.deleteNotification(id);
  }

  trackByNotificationId(index: number, notification: Notification): string {
    return notification.id;
  }

  getTimeAgo(timestamp: Date): string {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) {
      return `${days}d atrás`;
    } else if (hours > 0) {
      return `${hours}h atrás`;
    } else if (minutes > 0) {
      return `${minutes}min atrás`;
    } else {
      return 'Agora';
    }
  }
}