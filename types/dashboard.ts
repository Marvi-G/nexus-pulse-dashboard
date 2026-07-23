export interface StatCardData {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: string;
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
}

export interface CategoryOrder {
  category: string;
  orders: number;
}

export interface TrafficSource {
  source: string;
  value: number;
  color: string;
}

export interface DashboardData {
  stats: StatCardData[];
  revenueOverTime: RevenueDataPoint[];
  ordersByCategory: CategoryOrder[];
  trafficSources: TrafficSource[];
}
