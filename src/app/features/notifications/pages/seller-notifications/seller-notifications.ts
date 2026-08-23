import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService, Notification } from '../../services/notification-service';

@Component({
  selector: 'app-seller-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seller-notifications.html',
  styleUrl: './seller-notifications.css',
})
export class SellerNotifications implements OnInit {
  notificationService = inject(NotificationService);

  ngOnInit(): void {
    this.notificationService.start();
  }

  getIcon(type: string): string {
    switch (type?.toLowerCase()) {
      case 'payment':
        return 'payment';
      case 'message':
        return 'message';
      case 'view':
        return 'view';
      case 'favorite':
        return 'favorite';
      default:
        return 'default';
    }
  }

  getStatusClass(notif: Notification): string {
    const type = notif?.type?.toLowerCase();
    if (type === 'payment') return 'notif-success';
    if (type === 'cancel' || type === 'cancelled') return 'notif-cancel';
    if (type === 'message') return 'notif-message';
    if (type === 'view') return 'notif-view';
    return '';
  }

  onCardClick(notif: Notification) {
    if (!notif.isRead) {
      this.notificationService.markAsRead(notif.id);
    }
  }
}
