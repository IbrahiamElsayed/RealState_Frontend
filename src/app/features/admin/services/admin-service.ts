import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { AdminStats } from '../models/admin-stats';
import { AdminUser } from '../models/admin-user';
import { PagedResult } from '../../properties/models/paged-result';

export type PropertyModerationStatus = 'pending' | 'approved' | 'rejected';

export interface AdminProperty {
  id: number;
  title: string;
  price: number;
  cityName: string;
  propertyTypeName: string;
  mainImage?: string | null;
  isVerified: boolean;
  isAvailable: boolean;
  ownerName?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private http = inject(HttpClient);
  private api = 'https://localhost:7024/api/Admin';
  private imageBaseUrl = 'https://localhost:7024';

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.api}/dashboard-stats`);
  }

  getUsers(
    pageNumber: number,
    pageSize: number,
    search = '',
    role = '',
  ): Observable<PagedResult<AdminUser>> {
    let params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    if (search.trim()) {
      params = params.set('search', search.trim());
    }
    if (role) {
      params = params.set('role', role);
    }

    return this.http.get<PagedResult<AdminUser>>(`${this.api}/users`, { params });
  }

  updateUserRole(userId: string, role: string): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.api}/users/${userId}/role`, { role });
  }

  deleteUser(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/users/${userId}`);
  }

  getProperties(status?: PropertyModerationStatus): Observable<AdminProperty[]> {
    const params = status ? new HttpParams().set('status', status) : undefined;
    return this.http.get<AdminProperty[]>(`${this.api}/properties`, { params });
  }

  approveProperty(propertyId: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.api}/properties/${propertyId}/approve`,
      {},
    );
  }

  rejectProperty(propertyId: number): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.api}/properties/${propertyId}/reject`, {});
  }

  deleteProperty(propertyId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.api}/properties/${propertyId}`);
  }

  imageUrl(mainImage?: string | null): string {
    return mainImage ? `${this.imageBaseUrl}${mainImage}` : '/assets/images/no-image.jpg';
  }
}
