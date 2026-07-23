import type { User } from '~/types/user';
import type { DashboardData } from '~/types/dashboard';
import type { AnalyticsData, SignupDataPoint, CategoryRevenue, TopProduct } from '~/types/analytics';

/* ───────────────────────────────────────────
   Users (50+ mock rows)
   ─────────────────────────────────────────── */
const firstNames = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason',
  'Isabella', 'William', 'Mia', 'James', 'Charlotte', 'Benjamin', 'Amelia',
  'Lucas', 'Harper', 'Henry', 'Evelyn', 'Alexander', 'Abigail', 'Daniel',
  'Emily', 'Michael', 'Ella', 'Sebastian', 'Scarlett', 'Jack', 'Grace',
  'Owen', 'Chloe', 'Theodore', 'Victoria', 'Aiden', 'Riley', 'Samuel',
  'Aria', 'Joseph', 'Lily', 'John', 'Aurora', 'David', 'Zoey', 'Wyatt',
  'Nora', 'Matthew', 'Camila', 'Luke', 'Hannah', 'Leo', 'Layla',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
  'Ramirez', 'Lewis', 'Robinson',
];

const roles: User['role'][] = ['Admin', 'Editor', 'Viewer'];
const statuses: User['status'][] = ['Active', 'Active', 'Active', 'Inactive', 'Pending'];

function generateUsers(count: number): User[] {
  const users: User[] = [];
  for (let i = 0; i < count; i++) {
    const first = firstNames[i % firstNames.length];
    const last = lastNames[i % lastNames.length];
    const daysAgo = Math.floor(Math.random() * 730);
    const date = new Date();
    date.setDate(date.getDate() - daysAgo);

    users.push({
      id: i + 1,
      name: `${first} ${last}`,
      email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
      role: roles[i % roles.length],
      status: statuses[i % statuses.length],
      joinDate: date.toISOString().split('T')[0],
    });
  }
  return users;
}

export const mockUsers: User[] = generateUsers(53);

/* ───────────────────────────────────────────
   Dashboard data
   ─────────────────────────────────────────── */
export const mockDashboardData: DashboardData = {
  stats: [
    {
      title: 'Total Revenue',
      value: '$284,500',
      change: 12.5,
      changeLabel: 'vs last month',
      icon: 'currency',
    },
    {
      title: 'Active Users',
      value: '14,832',
      change: 8.2,
      changeLabel: 'vs last month',
      icon: 'users',
    },
    {
      title: 'Orders',
      value: '3,462',
      change: -2.4,
      changeLabel: 'vs last month',
      icon: 'orders',
    },
    {
      title: 'Conversion Rate',
      value: '3.24%',
      change: 1.8,
      changeLabel: 'vs last month',
      icon: 'conversion',
    },
  ],
  revenueOverTime: [
    { month: 'Jan', revenue: 18500 },
    { month: 'Feb', revenue: 21200 },
    { month: 'Mar', revenue: 19800 },
    { month: 'Apr', revenue: 24300 },
    { month: 'May', revenue: 22100 },
    { month: 'Jun', revenue: 26800 },
    { month: 'Jul', revenue: 25400 },
    { month: 'Aug', revenue: 28900 },
    { month: 'Sep', revenue: 27100 },
    { month: 'Oct', revenue: 31200 },
    { month: 'Nov', revenue: 29800 },
    { month: 'Dec', revenue: 34500 },
  ],
  ordersByCategory: [
    { category: 'Electronics', orders: 1240 },
    { category: 'Clothing', orders: 980 },
    { category: 'Food', orders: 760 },
    { category: 'Books', orders: 540 },
    { category: 'Sports', orders: 420 },
    { category: 'Home', orders: 380 },
  ],
  trafficSources: [
    { source: 'Organic', value: 42, color: '#6366f1' },
    { source: 'Paid', value: 28, color: '#8b5cf6' },
    { source: 'Social', value: 18, color: '#a78bfa' },
    { source: 'Direct', value: 12, color: '#c4b5fd' },
  ],
};

/* ───────────────────────────────────────────
   Analytics data
   ─────────────────────────────────────────── */
function generateSignups(days: number): SignupDataPoint[] {
  const data: SignupDataPoint[] = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      date: date.toISOString().split('T')[0],
      signups: Math.floor(Math.random() * 80) + 20,
    });
  }
  return data;
}

const categoryNames = ['Electronics', 'Clothing', 'Food', 'Books', 'Sports', 'Home'];

function generateCategoryRevenue(months: number): CategoryRevenue[] {
  return categoryNames.map((category) => ({
    category,
    revenue: Array.from({ length: months }, () => Math.floor(Math.random() * 15000) + 5000),
  }));
}

const productNames = [
  'Wireless Headphones', 'Smart Watch Pro', 'Laptop Stand', 'USB-C Hub',
  'Running Shoes', 'Yoga Mat', 'Coffee Maker', 'Desk Lamp',
  'Mechanical Keyboard', 'Portable Charger',
];

function generateTopProducts(): TopProduct[] {
  return productNames.map((name) => ({
    name,
    sales: Math.floor(Math.random() * 900) + 100,
  })).sort((a, b) => b.sales - a.sales);
}

export function getAnalyticsData(days: number, _category: string): AnalyticsData {
  return {
    signupsOverTime: generateSignups(days),
    revenueByCategory: generateCategoryRevenue(Math.ceil(days / 30)),
    topProducts: generateTopProducts(),
  };
}
