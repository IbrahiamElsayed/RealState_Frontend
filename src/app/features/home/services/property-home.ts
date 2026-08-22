import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PropertyHome } from '../models/property-home';

@Injectable({
  providedIn: 'root',
})
export class PropertyHomeService {
  private apiUrl = 'https://localhost:7024/api/Property';

  private _properties = signal<PropertyHome[]>([]);
  properties = this._properties.asReadonly();

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  constructor(private http: HttpClient) {}

  loadHomeProperties() {
    this._loading.set(true);

    this.http.get<PropertyHome[]>(`${this.apiUrl}/home`).subscribe({
      next: (res) => {
        this._properties.set(res);
        this._loading.set(false);
      },
      error: () => this._loading.set(false),
    });
  }
}
