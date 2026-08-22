import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:7024/api/Profile';

  cached = signal<any>(null);

  getProfile() {
    return this.http.get(this.baseUrl).pipe(tap((res) => this.cached.set(res)));
  }

  updateProfile(data: any) {
    return this.http.put(this.baseUrl, data).pipe(tap(() => this.cached.set(data)));
  }

  deleteProfile() {
    return this.http.delete(this.baseUrl).pipe(tap(() => this.cached.set(null)));
  }

  clearCache() {
    this.cached.set(null);
  }
}
