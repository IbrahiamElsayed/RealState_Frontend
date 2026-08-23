import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { AdminService } from '../../services/admin-service';
import { AdminStats } from '../../models/admin-stats';

interface StatCard {
  label: string;
  value: string;
  sub?: string;
  icon: 'users' | 'buyer' | 'seller' | 'properties' | 'pending';
  theme: string;
}

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private adminService = inject(AdminService);

  stats: AdminStats | null = null;
  loading = true;

  cards: StatCard[] = [];
  buyerPercent = 0;
  sellerPercent = 0;

  ngOnInit(): void {
    this.adminService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.cards = [
          {
            label: 'Total Users',
            value: this.format(stats.totalUsers),
            icon: 'users',
            theme: 'violet',
          },
          {
            label: 'Buyers',
            value: this.format(stats.totalBuyers),
            sub: this.percentOf(stats.totalBuyers, stats.totalUsers),
            icon: 'buyer',
            theme: 'blue',
          },
          {
            label: 'Sellers',
            value: this.format(stats.totalSellers),
            sub: this.percentOf(stats.totalSellers, stats.totalUsers),
            icon: 'seller',
            theme: 'emerald',
          },
          {
            label: 'Properties',
            value: this.format(stats.totalProperties),
            icon: 'properties',
            theme: 'amber',
          },
          {
            label: 'Pending Review',
            value: this.format(stats.pendingProperties),
            sub: stats.pendingProperties > 0 ? 'Needs moderation' : 'All clear',
            icon: 'pending',
            theme: 'rose',
          },
        ];

        const totalRoles = stats.totalBuyers + stats.totalSellers;
        this.buyerPercent = totalRoles > 0 ? Math.round((stats.totalBuyers / totalRoles) * 100) : 0;
        this.sellerPercent = totalRoles > 0 ? 100 - this.buyerPercent : 0;

        this.loading = false;
      },
      error: () => (this.loading = false),
    });
  }

  format(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  percentOf(part: number, total: number): string {
    if (total === 0) return '0% of users';
    return `${Math.round((part / total) * 100)}% of users`;
  }
}
