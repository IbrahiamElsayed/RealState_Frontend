import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private apiUrl = 'https://localhost:7024/api/Favorite';

  constructor(private http: HttpClient) {}

  add(propertyId: number) {
    return this.http.post(`${this.apiUrl}/add`, {
      propertyId,
    });
  }

  remove(propertyId: number) {
    return this.http.delete(`${this.apiUrl}/delete/${propertyId}`);
  }

  getByUser() {
    return this.http.get<any[]>(this.apiUrl);
  }
}
