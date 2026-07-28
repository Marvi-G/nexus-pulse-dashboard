import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { DateRange, AnalyticsData, SignupDataPoint, CategoryRevenue, TopProduct } from '~/types/analytics';
import { getAnalyticsData } from '~/utils/mockData';

export const useAnalyticsStore = defineStore('analytics', () => {
  const dateRange = ref<DateRange>('30d');
  const category = ref<string>('All');
  const isLoading = ref(false);
  const signupsOverTime = ref<SignupDataPoint[]>([]);
  const revenueByCategory = ref<CategoryRevenue[]>([]);
  const topProducts = ref<TopProduct[]>([]);

  const dateRangeDays = computed(() => {
    switch (dateRange.value) {
      case '7d': return 7;
      case '30d': return 30;
      case '90d': return 90;
      default: return 30;
    }
  });

  const availableCategories = ['All', 'Electronics', 'Clothing', 'Food', 'Books', 'Sports', 'Home'];

  async function fetchData() {
    isLoading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 600));

    const data = getAnalyticsData(dateRangeDays.value, category.value);
    signupsOverTime.value = data.signupsOverTime;
    revenueByCategory.value = data.revenueByCategory;
    topProducts.value = data.topProducts;

    isLoading.value = false;
  }

  function setDateRange(range: DateRange) {
    dateRange.value = range;
    fetchData();
  }

  function setCategory(cat: string) {
    category.value = cat;
    fetchData();
  }

  return {
    dateRange,
    category,
    isLoading,
    signupsOverTime,
    revenueByCategory,
    topProducts,
    dateRangeDays,
    availableCategories,
    fetchData,
    setDateRange,
    setCategory,
  };
});
