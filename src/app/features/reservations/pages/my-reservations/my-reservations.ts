import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { ReservationService } from '../../services/reservation-service';
import { Reservation } from '../../models/reservation';

@Component({
  selector: 'app-my-reservations',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './my-reservations.html',
  styleUrl: './my-reservations.css',
})
export class MyReservations implements OnInit {
  reservationService = inject(ReservationService);

  reservations: Reservation[] = [];
  loading = true;
  error: string | null = null;

  ngOnInit(): void {
    this.reservationService.getMyReservations().subscribe({
      next: (data) => {
        this.reservations = data || [];
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load your reservations.';
        this.loading = false;
      },
    });
  }

  imageUrl(path: string): string {
    if (!path) return 'images/placeholder.png';
    if (path.startsWith('http')) return path;
    return `https://localhost:7024${path}`;
  }

  totalPaid(): number {
    return this.reservations
      .filter((r) => r.status === 'Paid')
      .reduce((sum, r) => sum + r.amount, 0);
  }

  paidCount(): number {
    return this.reservations.filter((r) => r.status === 'Paid').length;
  }
}
