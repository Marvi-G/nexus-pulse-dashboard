import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { DashboardData, StatCardData, RevenueDataPoint, CategoryOrder, TrafficSource } from '~/types/dashboard';
import { mockDashboardData } from '~/utils/mockData';

export const useDashboardStore = defineStore('dashboard', () => {
  const isLoading = ref(false);
  const stats = ref<StatCardData[]>([]);
  const revenueOverTime = ref<RevenueDataPoint[]>([]);
  const ordersByCategory = ref<CategoryOrder[]>([]);
  const trafficSources = ref<TrafficSource[]>([]);

  async function fetchDashboardData() {
    isLoading.value = true;
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    const data: DashboardData = mockDashboardData;
    stats.value = data.stats;
    revenueOverTime.value = data.revenueOverTime;
    ordersByCategory.value = data.ordersByCategory;
    trafficSources.value = data.trafficSources;

    isLoading.value = false;
  }

  return {
    isLoading,
    stats,
    revenueOverTime,
    ordersByCategory,
    trafficSources,
    fetchDashboardData,
  };
});
