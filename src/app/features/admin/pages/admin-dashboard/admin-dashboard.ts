import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

import { AdminService } from '../../services/admin-service';
import { AdminStats } from '../../models/admin-stats';
import { AdminChart } from '../../models/admin-chart';

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
  imports: [CommonModule, RouterLink, BaseChartDirective],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  private adminService = inject(AdminService);

  stats: AdminStats | null = null;
  chartData: AdminChart | null = null;
  loading = true;

  cards: StatCard[] = [];
  buyerPercent = 0;
  sellerPercent = 0;

  salesChartData: ChartData<'line'> = { labels: [], datasets: [] };
  usersChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  cityChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };

  salesChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { callback: (v) => `${v}` } },
      x: { grid: { display: false } },
    },
  };

  usersChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
      x: { grid: { display: false } },
    },
  };

  cityChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'right', labels: { boxWidth: 12, padding: 12 } },
    },
  };

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

    this.adminService.getChartData().subscribe({
      next: (data) => {
        this.chartData = data;
        this.buildCharts(data);
      },
    });
  }

  private buildCharts(data: AdminChart): void {
    const teal = '#0d9488';
    const tealLight = 'rgba(13,148,136,0.15)';
    const violet = '#7c3aed';
    const violetLight = 'rgba(124,58,237,0.15)';
    const colors = ['#7c3aed', '#2563eb', '#059669', '#d97706', '#e11d48', '#0891b2'];

    this.salesChartData = {
      labels: data.monthlySales.map((d) => d.label),
      datasets: [
        {
          data: data.monthlySales.map((d) => d.value),
          label: 'Sales (EGP)',
          borderColor: teal,
          backgroundColor: tealLight,
          fill: true,
          tension: 0.4,
          pointRadius: 4,
          pointBackgroundColor: teal,
        },
      ],
    };

    this.usersChartData = {
      labels: data.monthlyUsers.map((d) => d.label),
      datasets: [
        {
          data: data.monthlyUsers.map((d) => d.value),
          label: 'New Users',
          borderColor: violet,
          backgroundColor: violetLight,
          borderRadius: 6,
        },
      ],
    };

    this.cityChartData = {
      labels: data.propertiesByCity.map((d) => d.city),
      datasets: [
        {
          data: data.propertiesByCity.map((d) => d.count),
          backgroundColor: colors.slice(0, data.propertiesByCity.length),
          borderWidth: 0,
        },
      ],
    };
  }

  format(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  percentOf(part: number, total: number): string {
    if (total === 0) return '0% of users';
    return `${Math.round((part / total) * 100)}% of users`;
  }
}
