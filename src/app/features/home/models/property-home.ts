export interface PropertyHome {
  id: number;
  title: string;
  description: string;
  price: number;
  address: string;
  listingType: string;
  beds: number;
  baths: number;
  sqFt: number;
  isAvailable: boolean;
  isVerified: boolean;
  viewsCount: number;
  cityName: string;
  propertyTypeName: string;
  mainImage: string | null;
  ownerName: string | null;
}
