export interface AdminChart {
  monthlySales: MonthlyData[];
  monthlyUsers: MonthlyData[];
  propertiesByCity: CityData[];
}

export interface MonthlyData {
  label: string;
  value: number;
}

export interface CityData {
  city: string;
  count: number;
}
