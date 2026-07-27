<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Page header -->
    <div>
      <h1 class="page-title">Dashboard</h1>
      <p class="page-subtitle">
        Welcome back! Here's what's happening with your business.
      </p>
    </div>

    <!-- Stat cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-6">
      <template v-if="dashboardStore.isLoading">
        <div v-for="i in 4" :key="i" class="card p-6 space-y-3">
          <div class="skeleton h-4 w-24" />
          <div class="skeleton h-8 w-32" />
          <div class="skeleton h-3 w-20" />
        </div>
      </template>
      <template v-else>
        <DashboardStatCard
          v-for="stat in dashboardStore.stats"
          :key="stat.title"
          :title="stat.title"
          :value="stat.value"
          :change="stat.change"
          :change-label="stat.changeLabel"
          :icon="stat.icon"
        />
      </template>
    </div>

    <!-- Charts row -->
    <div class="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
      <!-- Revenue chart (large) -->
      <div class="card p-6 xl:col-span-2">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h2
              class="text-base font-semibold text-[var(--color-text-primary)]"
            >
              Revenue Overview
            </h2>
            <p class="text-sm text-[var(--color-text-tertiary)] mt-0.5">
              Last 12 months
            </p>
          </div>
          <div
            class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--color-success-light)]"
          >
            <svg
              class="w-3.5 h-3.5 text-[var(--color-success)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M4.5 15.75l7.5-7.5 7.5 7.5"
              />
            </svg>
            <span class="text-xs font-semibold text-[var(--color-success)]"
              >+12.5%</span
            >
          </div>
        </div>
        <ChartsLineChart
          :labels="dashboardStore.revenueOverTime.map((d) => d.month)"
          :datasets="[
            {
              label: 'Revenue',
              data: dashboardStore.revenueOverTime.map((d) => d.revenue),
            },
          ]"
          :height="280"
        />
      </div>

      <!-- Traffic sources -->
      <div class="card p-6">
        <h2
          class="text-base font-semibold text-[var(--color-text-primary)] mb-6"
        >
          Traffic Sources
        </h2>
        <ChartsDoughnutChart
          :labels="dashboardStore.trafficSources.map((t) => t.source)"
          :data="dashboardStore.trafficSources.map((t) => t.value)"
          :colors="dashboardStore.trafficSources.map((t) => t.color)"
          :height="220"
        />
        <!-- Legend -->
        <div class="mt-6 space-y-3">
          <div
            v-for="source in dashboardStore.trafficSources"
            :key="source.source"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-2.5">
              <div
                class="w-3 h-3 rounded-full"
                :style="{ backgroundColor: source.color }"
              />
              <span class="text-sm text-[var(--color-text-secondary)]">{{
                source.source
              }}</span>
            </div>
            <span class="text-sm font-semibold text-[var(--color-text-primary)]"
              >{{ source.value }}%</span
            >
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom row -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
      <!-- Orders by category -->
      <div class="card p-6">
        <h2
          class="text-base font-semibold text-[var(--color-text-primary)] mb-6"
        >
          Orders by Category
        </h2>
        <ChartsBarChart
          :labels="dashboardStore.ordersByCategory.map((c) => c.category)"
          :datasets="[
            {
              label: 'Orders',
              data: dashboardStore.ordersByCategory.map((c) => c.orders),
            },
          ]"
          :height="260"
        />
      </div>

      <!-- Recent activity -->
      <DashboardRecentActivity />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useDashboardStore } from "~/stores/dashboard";

definePageMeta({
  middleware: "auth",
});

const dashboardStore = useDashboardStore();

onMounted(() => {
  dashboardStore.fetchDashboardData();
});
</script>
