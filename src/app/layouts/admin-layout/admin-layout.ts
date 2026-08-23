import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth-service';
import {
  NotificationService,
  Notification,
} from '../../features/notifications/services/notification-service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout implements OnInit {
  private router = inject(Router);
  authService = inject(AuthService);
  notificationService = inject(NotificationService);

  panelOpen = false;

  ngOnInit(): void {
    this.notificationService.start();
  }

  get user() {
    return this.authService.getUser();
  }

  get notifications(): Notification[] {
    return this.notificationService.notifications();
  }

  get unreadCount(): number {
    return this.notifications.filter((n) => !n.isRead).length;
  }

  iconClass(type: string): string {
    const key = (type || '').toLowerCase();
    if (key.includes('prop')) return 't-property';
    if (key.includes('pay')) return 't-payment';
    if (key.includes('mess') || key.includes('chat')) return 't-message';
    return 't-info';
  }

  togglePanel() {
    this.panelOpen = !this.panelOpen;
  }

  closePanel() {
    this.panelOpen = false;
  }

  openNotification(n: Notification) {
    if (!n.isRead) {
      this.notificationService.markAsRead(n.id);
      this.notificationService.notifications.update((list) =>
        list.map((x) => (x.id === n.id ? { ...x, isRead: true } : x)),
      );
    }

    if ((n.type || '').toLowerCase().includes('prop')) {
      this.router.navigate(['/admin/properties']);
    }

    this.closePanel();
  }

  markAllRead() {
    this.notifications
      .filter((n) => !n.isRead)
      .forEach((n) => this.notificationService.markAsRead(n.id));

    this.notificationService.notifications.update((list) =>
      list.map((x) => ({ ...x, isRead: true })),
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
