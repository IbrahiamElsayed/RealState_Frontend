import { Property } from './property';

export interface SellerDashboard {
  totalProperties: number;
  availableProperties: number;
  unavailableProperties: number;
  totalViews: number;
  latestProperties: Property[];
  topViewedProperties: Property[];
}
