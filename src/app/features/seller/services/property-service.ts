import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AddPropertyResponse } from '../models/add-property-response';
import { AddProperty } from '../models/add-property';

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  private http = inject(HttpClient);

  apiUrl = 'https://localhost:7024/api/Property';

  loading = signal(false);
  error = signal<string | null>(null);

  addProperty(property: AddProperty) {
    const formData = new FormData();

    formData.append('Title', property.title);
    formData.append('Description', property.description);
    formData.append('Price', String(property.price));
    formData.append('Address', property.address);
    formData.append('ListingType', property.listingType);
    formData.append('Beds', String(property.beds));
    formData.append('Baths', String(property.baths));
    formData.append('SqFt', String(property.sqFt));
    formData.append('CityName', property.cityName);
    formData.append('PropertyTypeName', property.propertyTypeName);

    property.images.forEach((image) => {
      formData.append('Images', image);
    });

    this.loading.set(true);
    this.error.set(null);

    return this.http.post<AddPropertyResponse>(`${this.apiUrl}/add`, formData);
  }
}
