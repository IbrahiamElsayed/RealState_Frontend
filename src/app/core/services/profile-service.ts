import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { tap } from 'rxjs';
import { Profile } from '../../features/profile/models/profile';

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private http = inject(HttpClient);
  private baseUrl = 'https://localhost:7024/api/Profile';

  cached = signal<Profile | null>(null);

  getProfile() {
    return this.http.get<Profile>(this.baseUrl).pipe(tap((res) => this.cached.set(res)));
  }

  updateProfile(data: Partial<Profile>) {
    return this.http.put<{ message: string }>(this.baseUrl, data);
  }

  deleteProfile() {
    return this.http.delete<{ message: string }>(this.baseUrl).pipe(tap(() => this.cached.set(null)));
  }

  clearCache() {
    this.cached.set(null);
  }
}
