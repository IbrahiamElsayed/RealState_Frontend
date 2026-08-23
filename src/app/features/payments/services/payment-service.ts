import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaymentService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7024/api/Payment';

  checkout(propertyId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/checkout/${propertyId}`, {});
  }

  success(sessionId: string): Observable<string> {
    return this.http.get(`${this.apiUrl}/success?sessionId=${sessionId}`, { responseType: 'text' });
  }
  cancel(): Observable<any> {
    return this.http.get(`${this.apiUrl}/cancel`);
  }
}
