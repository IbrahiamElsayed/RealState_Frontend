export interface AddProperty {
  title: string;
  description: string;
  price: number;
  address: string;
  listingType: string;
  beds: number;
  baths: number;
  sqFt: number;
  cityName: string;
  propertyTypeName: string;
  images: File[];
}
