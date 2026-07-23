export interface SignupDataPoint {
  date: string;
  signups: number;
}

export interface CategoryRevenue {
  category: string;
  revenue: number[];
}

export interface TopProduct {
  name: string;
  sales: number;
}

export type DateRange = '7d' | '30d' | '90d' | 'custom';

export interface AnalyticsFilters {
  dateRange: DateRange;
  category: string;
}

export interface AnalyticsData {
  signupsOverTime: SignupDataPoint[];
  revenueByCategory: CategoryRevenue[];
  topProducts: TopProduct[];
}
