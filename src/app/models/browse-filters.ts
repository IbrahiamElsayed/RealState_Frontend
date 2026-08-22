export interface BrowseFilters {
  search?: string;

  cityName?: string;

  propertyTypeName?: string;

  minPrice?: number | null;
  maxPrice?: number | null;

  minBeds?: number | null;
  minBaths?: number | null;
  minSqFt?: number | null;

  sortBy?: 'latest' | 'priceAsc' | 'priceDesc';

  pageNumber: number;
  pageSize: number;
}
