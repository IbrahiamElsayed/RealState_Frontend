import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PropertyDetails } from '../models/property-details';

@Injectable({
  providedIn: 'root',
})
export class PropertyDetailsService {
  private apiUrl = 'https://localhost:7024/api/Property';

  private _propertyDetails = signal<PropertyDetails | null>(null);
  propertyDetails = this._propertyDetails.asReadonly();

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  constructor(private http: HttpClient) {}

  loadPropertyById(id: number) {
    this._loading.set(true);

    this.http.get<PropertyDetails>(`${this.apiUrl}/getbyid/${id}`).subscribe({
      next: (res) => {
        this._propertyDetails.set(res);
        this._loading.set(false);
      },
      error: () => this._loading.set(false),
    });
  }
}
