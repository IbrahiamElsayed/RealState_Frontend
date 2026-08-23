import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BrowsePropertyService } from '../../services/browse-property-service';
import { BrowseFilters } from '../../models/browse-filters';
import { FavoriteService } from '../../../favorites/services/favorite-service';

@Component({
  selector: 'app-browse-properties',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './browse-properties.html',
  styleUrl: './browse-properties.css',
})
export class BrowseProperties implements OnInit {
  propertyService = inject(BrowsePropertyService);
  favoriteService = inject(FavoriteService);

  searchTerm = '';
  private searchTimeout: any;

  filters: BrowseFilters = {
    pageNumber: 1,
    pageSize: 6,
    search: '',
    cityName: '',
    propertyTypeName: '',
    minPrice: null,
    maxPrice: null,
    minBeds: null,
    minBaths: null,
    minSqFt: null,
    sortBy: 'latest',
  };

  ngOnInit(): void {
    this.loadData();
    this.propertyService.loadCities();
    this.propertyService.loadPropertyTypes();
  }

  loadData() {
    this.propertyService.loadProperties(this.filters);
  }

  onSearchInput() {
    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(() => {
      this.filters.pageNumber = 1;
      if (this.searchTerm.trim()) {
        this.propertyService.searchProperties(this.searchTerm.trim());
      } else {
        this.loadData();
      }
    }, 300);
  }

  clearSearch() {
    this.searchTerm = '';
    this.filters.search = '';
    this.filters.pageNumber = 1;
    this.loadData();
  }

  onFilterChange() {
    this.filters.pageNumber = 1;
    if (this.searchTerm.trim()) {
      this.propertyService.searchProperties(this.searchTerm.trim());
    } else {
      this.loadData();
    }
  }

  resetFilters() {
    this.filters = {
      pageNumber: 1,
      pageSize: 6,
      search: '',
      cityName: '',
      propertyTypeName: '',
      minPrice: null,
      maxPrice: null,
      minBeds: null,
      minBaths: null,
      minSqFt: null,
      sortBy: 'latest',
    };
    this.loadData();
  }

  totalPages(): number {
    return this.propertyService.totalPages();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages() || page === this.filters.pageNumber) {
      return;
    }
    this.filters.pageNumber = page;
    this.loadData();
  }

  pages(): number[] {
    const total = this.totalPages();
    const current = this.filters.pageNumber;
    const range: number[] = [];
    let start = Math.max(1, current - 2);
    const end = Math.min(total, start + 4);
    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }
    for (let i = start; i <= end; i++) {
      range.push(i);
    }
    return range;
  }

  hasActiveFilters(): boolean {
    return !!(
      this.filters.cityName ||
      this.filters.propertyTypeName ||
      this.filters.minBeds ||
      this.filters.minBaths ||
      this.filters.minSqFt ||
      this.filters.minPrice ||
      this.filters.maxPrice
    );
  }

  activeFilterCount(): number {
    let count = 0;
    if (this.filters.cityName) count++;
    if (this.filters.propertyTypeName) count++;
    if (this.filters.minBeds) count++;
    if (this.filters.minBaths) count++;
    if (this.filters.minSqFt) count++;
    if (this.filters.minPrice) count++;
    if (this.filters.maxPrice) count++;
    return count;
  }

  toggleFavorite(property: any) {
    property.isFavorite = !property.isFavorite;
    if (property.isFavorite) {
      this.favoriteService.add(property.id).subscribe({
        error: () => (property.isFavorite = false),
      });
    } else {
      this.favoriteService.remove(property.id).subscribe({
        error: () => (property.isFavorite = true),
      });
    }
  }
}
