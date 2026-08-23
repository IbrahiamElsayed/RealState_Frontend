import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat-service';
import { ActivatedRoute, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './message.html',
  styleUrl: './message.css',
})
export class Message implements OnInit {
  service = inject(ChatService);
  route = inject(ActivatedRoute);
  router = inject(Router);

  currentUserId = '';
  selectedUserId = '';
  message = '';

  async ngOnInit() {
    this.currentUserId = this.getUserIdFromToken();
    await this.service.startConnection();
    this.service.messages.set([]);

    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.selectedUserId = id;
        this.service.activeChatUserId.set(id);
        this.openChat(id);
      } else {
        this.service.getUsers().subscribe((users) => {
          if (users && users.length > 0) {
            this.router.navigate(['/message', users[0].id]);
          }
        });
      }
    });
  }

  openChat(userId: string) {
    this.selectedUserId = userId;
    this.service.getChat(userId).subscribe({
      next: (res) => {
        const formatted = (res ?? []).map((m: any) => ({
          id: m.id ?? m.Id,
          senderId: m.senderId ?? m.SenderId,
          receiverId: m.receiverId ?? m.ReceiverId,
          content: m.content ?? m.Content,
          sentAt: m.sentAt ?? m.SentAt,
        }));
        this.service.messages.set(formatted);
      },
    });
  }

  send() {
    if (!this.message.trim() || !this.selectedUserId) return;
    this.service.send(this.selectedUserId, this.message).subscribe({
      next: () => (this.message = ''),
    });
  }

  private getUserIdFromToken(): string {
    const token = localStorage.getItem('token');
    if (!token) return '';

    try {
      const decoded: any = jwtDecode(token);
      return (
        decoded[
          'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'
        ] ?? ''
      );
    } catch {
      return '';
    }
  }
}
