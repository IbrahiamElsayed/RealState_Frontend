import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, finalize, throwError } from 'rxjs';
import { UpdateProperty } from '../models/update-property';

@Injectable({
  providedIn: 'root',
})
export class UpdatePropertyService {
  private http = inject(HttpClient);
  private apiUrl = 'https://localhost:7024/api/Property';

  loading = signal(false);
  error = signal<string | null>(null);

  updateProperty(property: UpdateProperty) {
    this.loading.set(true);
    this.error.set(null);

    return this.http.put(`${this.apiUrl}/edit`, property).pipe(
      finalize(() => {
        this.loading.set(false);
      }),
      catchError((error) => {
        this.error.set(error.error?.message || 'Failed to update property');
        return throwError(() => error);
      }),
    );
  }

  getPropertyById(id: any) {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<UpdateProperty>(`${this.apiUrl}/${id}`).pipe(
      finalize(() => {
        this.loading.set(false);
      }),
      catchError((error) => {
        this.error.set(error.error?.message || 'Failed to load property');
        return throwError(() => error);
      }),
    );
  }
}
