import { Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

import { BrowseProperty } from '../models/browse-property';
import { BrowseResponse } from '../models/browse-response';
import { City } from '../models/city';
import { PropertyType } from '../models/property-type';
import { BrowseFilters } from '../models/browse-filters';

@Injectable({
  providedIn: 'root',
})
export class BrowsePropertyService {
  private propertyApi = 'https://localhost:7024/api/Property';
  private cityApi = 'https://localhost:7024/api/City';
  private propertyTypeApi = 'https://localhost:7024/api/PropertyType';
  private imageBaseUrl = 'https://localhost:7024';

  constructor(private http: HttpClient) {}

  private _properties = signal<BrowseProperty[]>([]);
  properties = this._properties.asReadonly();

  private _cities = signal<City[]>([]);
  cities = this._cities.asReadonly();

  private _propertyTypes = signal<PropertyType[]>([]);
  propertyTypes = this._propertyTypes.asReadonly();

  private _pageNumber = signal(1);
  pageNumber = this._pageNumber.asReadonly();

  private _pageSize = signal(6);
  pageSize = this._pageSize.asReadonly();

  private _totalCount = signal(0);
  totalCount = this._totalCount.asReadonly();

  private _loading = signal(false);
  loading = this._loading.asReadonly();

  private _searching = signal(false);
  searching = this._searching.asReadonly();

  loadProperties(filters: BrowseFilters) {
    this._loading.set(true);

    let params = new HttpParams()
      .set('pageNumber', filters.pageNumber)
      .set('pageSize', filters.pageSize);

    if (filters.search?.trim()) {
      params = params.set('search', filters.search);
    }
    if (filters.cityName?.trim()) {
      params = params.set('cityName', filters.cityName);
    }
    if (filters.propertyTypeName?.trim()) {
      params = params.set('propertyTypeName', filters.propertyTypeName);
    }
    if (filters.minPrice != null) {
      params = params.set('minPrice', filters.minPrice);
    }
    if (filters.maxPrice != null) {
      params = params.set('maxPrice', filters.maxPrice);
    }
    if (filters.minBeds != null) {
      params = params.set('minBeds', filters.minBeds);
    }
    if (filters.minBaths != null) {
      params = params.set('minBaths', filters.minBaths);
    }
    if (filters.minSqFt != null) {
      params = params.set('minSqFt', filters.minSqFt);
    }
    if (filters.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }

    this.http.get<BrowseResponse>(`${this.propertyApi}/browse`, { params }).subscribe({
      next: (res) => {
        this._properties.set(
          res.data.map((p) => ({
            ...p,
            mainImage: p.mainImage
              ? `${this.imageBaseUrl}${p.mainImage}`
              : '/assets/images/no-image.jpg',
          })),
        );
        this._pageNumber.set(res.pageNumber);
        this._pageSize.set(res.pageSize);
        this._totalCount.set(res.totalCount);
        this._loading.set(false);
        this._searching.set(false);
      },
      error: () => {
        this._loading.set(false);
        this._searching.set(false);
      },
    });
  }

  searchProperties(term: string) {
    this._searching.set(true);
    this._loading.set(true);

    this.http
      .get<BrowseProperty[]>(`${this.propertyApi}/searchByTitle`, {
        params: new HttpParams().set('searchByTitle', term),
      })
      .subscribe({
        next: (res) => {
          this._properties.set(
            res.map((p) => ({
              ...p,
              mainImage: p.mainImage
                ? `${this.imageBaseUrl}${p.mainImage}`
                : '/assets/images/no-image.jpg',
            })),
          );
          this._totalCount.set(res.length);
          this._pageNumber.set(1);
          this._searching.set(false);
          this._loading.set(false);
        },
        error: () => {
          this._searching.set(false);
          this._loading.set(false);
        },
      });
  }

  loadCities() {
    this.http.get<City[]>(this.cityApi).subscribe({
      next: (res) => this._cities.set(res),
    });
  }

  loadPropertyTypes() {
    this.http.get<PropertyType[]>(this.propertyTypeApi).subscribe({
      next: (res) => this._propertyTypes.set(res),
    });
  }

  clearProperties() {
    this._properties.set([]);
    this._totalCount.set(0);
    this._pageNumber.set(1);
  }
}
