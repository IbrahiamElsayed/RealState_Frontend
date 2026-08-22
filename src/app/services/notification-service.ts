import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { retry, catchError, throwError } from 'rxjs';

export interface Notification {
  id: string;
  text: string;
  message?: string;
  type: string;
  createdAt: string;
  date?: string;
  isRead: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private http = inject(HttpClient);
  public notifications = signal<Notification[]>([]);
  public loading = signal(false);
  public error = signal<string | null>(null);
  private hubConnection!: signalR.HubConnection;
  private apiUrl = 'https://localhost:7024/api/Notification';

  public loadOldNotifications() {
    this.loading.set(true);
    this.error.set(null);

    this.http
      .get<Notification[]>(`${this.apiUrl}/my-notifications`)
      .pipe(
        retry(2),
        catchError((err: HttpErrorResponse) => {
          this.error.set(
            err.status === 0
              ? 'Cannot connect to server'
              : 'Failed to load notifications',
          );
          this.loading.set(false);
          return throwError(() => err);
        }),
      )
      .subscribe((data) => {
        this.notifications.set(data || []);
        this.loading.set(false);
      });
  }

  public start() {
    this.loadOldNotifications();

    if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
      return;
    }

    const token = localStorage.getItem('token') || '';

    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7024/notificationHub', {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.hubConnection.start().then(() => this.registerNotificationListener());
  }

  private registerNotificationListener() {
    this.hubConnection.on('ReceiveNotification', (notification: Notification) => {
      this.notifications.update((old) => [notification, ...old]);
    });
  }

  public markAsRead(notificationId: string) {
    this.http.put(`${this.apiUrl}/${notificationId}/read`, {}).subscribe();
  }
}
