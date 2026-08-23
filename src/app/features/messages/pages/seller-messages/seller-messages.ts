import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat-service';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-seller-messages',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './seller-messages.html',
  styleUrl: './seller-messages.css',
})
export class SellerMessages implements OnInit {
  service = inject(ChatService);

  currentUserId = '';
  selectedUserId = '';
  message = '';

  ngOnInit() {
    this.currentUserId = this.getUserIdFromToken();
    this.service.startConnection();
    this.loadUsers();
  }

  loadUsers() {
    this.service.getUsers().subscribe({
      next: (res) => this.service.users.set(res ?? []),
    });
  }

  openChat(userId: string) {
    if (!userId) return;

    this.selectedUserId = userId;

    this.service.getChat(userId).subscribe({
      next: (res) => this.service.messages.set(res ?? []),
    });
  }

  getUserName(userId: string): string | undefined {
    return this.service.users().find((u) => u.id === userId)?.userName;
  }

  send() {
    if (!this.message.trim()) return;

    if (!this.selectedUserId) {
      alert('Select a user first');
      return;
    }

    const text = this.message;

    this.service.send(this.selectedUserId, text).subscribe({
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
