import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import * as signalR from '@microsoft/signalr';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ChatService {
  private http = inject(HttpClient);
  private hub!: signalR.HubConnection;

  messages = signal<any[]>([]);
  users = signal<any[]>([]);

  activeChatUserId = signal<string>('');

  baseUrl = 'https://localhost:7024/api/Message';

  getUsers() {
    return this.http.get<any[]>(`${this.baseUrl}/users`);
  }

  getChat(userId: string) {
    this.activeChatUserId.set(userId);
    return this.http.get<any[]>(`${this.baseUrl}/chat/${userId}`);
  }

  send(receiverId: string, content: string) {
    return this.http
      .post<any>(`${this.baseUrl}/send`, { receiverId, content })
      .pipe(tap((msg) => this.messages.update((list) => [...list, this.format(msg)])));
  }

  async startConnection() {
    if (this.hub && this.hub.state === signalR.HubConnectionState.Connected) {
      return;
    }

    const token = localStorage.getItem('token') || '';

    this.hub = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7024/chatHub', {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build();

    this.hub.on('ReceiveMessage', (msg) => {
      const incomingSenderId = (msg.senderId || msg.SenderId || '').toLowerCase();
      const currentActiveId = this.activeChatUserId().toLowerCase();

      if (incomingSenderId === currentActiveId) {
        this.messages.update((list) => [...list, this.format(msg)]);
      }
    });

    await this.hub.start();
  }

  private format(msg: any) {
    return {
      id: msg.id ?? msg.Id,
      senderId: msg.senderId ?? msg.SenderId,
      receiverId: msg.receiverId ?? msg.ReceiverId,
      content: msg.content ?? msg.Content,
      sentAt: msg.sentAt ?? msg.SentAt,
    };
  }
}
