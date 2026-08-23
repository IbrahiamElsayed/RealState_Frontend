import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Property } from '../models/property';

@Injectable({
  providedIn: 'root',
})
export class PropertiesService {
  private http = inject(HttpClient);

  apiUrl = 'https://localhost:7024/api/Property';

  properties = signal<Property[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  getMyProperties() {
    this.loading.set(true);
    this.error.set(null);

    this.http.get<Property[]>(`${this.apiUrl}/my-properties`).subscribe({
      next: (res) => {
        this.properties.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load properties');
        this.loading.set(false);
      },
    });
  }
  deleteProperty(id: number) {
    return this.http.delete(`${this.apiUrl}/delete/${id}`);
  }
}
