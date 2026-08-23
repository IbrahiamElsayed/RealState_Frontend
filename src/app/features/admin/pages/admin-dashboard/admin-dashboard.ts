import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminService } from '../../services/admin-service';
import { AdminStats } from '../../models/admin-stats';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private adminService = inject(AdminService);

  stats: AdminStats | null = null;
  loading = true;

  cards: {
    label: string;
    value: number;
    icon: 'users' | 'buyer' | 'seller' | 'properties' | 'pending' | 'sales';
    theme: string;
  }[] = [];

  ngOnInit(): void {
    this.adminService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.cards = [
          { label: 'Total Users', value: stats.totalUsers, icon: 'users', theme: 'violet' },
          { label: 'Buyers', value: stats.totalBuyers, icon: 'buyer', theme: 'blue' },
          { label: 'Sellers', value: stats.totalSellers, icon: 'seller', theme: 'emerald' },
          { label: 'Properties', value: stats.totalProperties, icon: 'properties', theme: 'amber' },
          { label: 'Pending Properties', value: stats.pendingProperties, icon: 'pending', theme: 'rose' },
        ];
        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }
}
