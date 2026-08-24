export interface Reservation {
  id: number;
  propertyId: number;
  propertyTitle: string;
  mainImage: string;
  cityName: string;
  amount: number;
  status: string;
  createdAt: string;
  paymentDate?: string;
}
