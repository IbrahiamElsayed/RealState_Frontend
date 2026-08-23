import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SellerDashboard } from '../models/seller-dashboard';

@Injectable({
  providedIn: 'root',
})
export class SellerDashboardService {
  private http = inject(HttpClient);

  private apiUrl = 'https://localhost:7024/api/Property';

  // signals (state management)
  dashboard = signal<SellerDashboard | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  // GET dashboard
  getDashboard() {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<SellerDashboard>(`${this.apiUrl}/dashboard`).subscribe({
      next: (res) => {
        this.dashboard.set(res);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Failed to load dashboard');
        this.loading.set(false);
      },
    });
  }

  // helper getters (optional clean usage)
  totalProperties = () => this.dashboard()?.totalProperties ?? 0;
  latest = () => this.dashboard()?.latestProperties ?? [];
  topViewed = () => this.dashboard()?.topViewedProperties ?? [];
}
