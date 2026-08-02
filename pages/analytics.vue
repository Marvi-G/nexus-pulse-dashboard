<template>
  <div class="space-y-8 animate-fade-in">
    <!-- Page header -->
    <div>
      <h1 class="page-title">Analytics</h1>
      <p class="page-subtitle">Detailed insights and performance metrics.</p>
    </div>

    <!-- Enhanced Filters -->
    <div class="card p-6">
      <div class="flex flex-col gap-4">
        <!-- Filter Row -->
        <div
          class="flex flex-col lg:flex-row items-start lg:items-center gap-4"
        >
          <!-- Date range buttons -->
          <div
            class="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-bg-tertiary)]"
          >
            <button
              v-for="range in dateRanges"
              :key="range.value"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                analyticsStore.dateRange === range.value
                  ? 'bg-[var(--color-bg-card)] text-[var(--color-text-primary)] shadow-soft'
                  : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]',
              ]"
              @click="analyticsStore.setDateRange(range.value)"
            >
              {{ range.label }}
            </button>
          </div>

          <!-- Category filter -->
          <div class="relative flex-1 max-w-xs">
            <select
              :value="analyticsStore.category"
              class="input-base pl-10 pr-10 appearance-none cursor-pointer"
              @change="
                analyticsStore.setCategory(
                  ($event.target as HTMLSelectElement).value,
                )
              "
            >
              <option
                v-for="cat in analyticsStore.availableCategories"
                :key="cat"
                :value="cat"
              >
                {{ cat }}
              </option>
            </select>
            <div
              class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-tertiary)]"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z"
                />
              </svg>
            </div>
            <div
              class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-[var(--color-text-tertiary)]"
            >
              <svg
                class="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M19.5 8.25l-7.5 7.5-7.5-7.5"
                />
              </svg>
            </div>
          </div>

          <!-- Clear filters button -->
          <button
            v-if="
              analyticsStore.dateRange !== '30d' ||
              analyticsStore.category !== 'All'
            "
            class="btn-ghost text-sm flex items-center gap-2"
            @click="clearFilters"
          >
            <svg
              class="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            Clear filters
          </button>
        </div>

        <!-- Active filter chips -->
        <div
          v-if="
            analyticsStore.dateRange !== '30d' ||
            analyticsStore.category !== 'All'
          "
          class="flex flex-wrap gap-2"
        >
          <div
            v-if="analyticsStore.dateRange !== '30d'"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] text-sm font-medium"
          >
            <span>{{ getDateRangeLabel(analyticsStore.dateRange) }}</span>
            <button
              @click="analyticsStore.setDateRange('30d')"
              class="hover:bg-[var(--color-accent)]/20 rounded-full p-0.5"
            >
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div
            v-if="analyticsStore.category !== 'All'"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] text-sm font-medium"
          >
            <span>{{ analyticsStore.category }}</span>
            <button
              @click="analyticsStore.setCategory('All')"
              class="hover:bg-[var(--color-accent)]/20 rounded-full p-0.5"
            >
              <svg
                class="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div
      v-if="analyticsStore.isLoading"
      class="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6"
    >
      <div v-for="i in 3" :key="i" class="card p-6 space-y-4">
        <div class="skeleton h-5 w-40" />
        <div class="skeleton h-[260px] w-full" />
      </div>
    </div>

    <!-- Charts -->
    <div v-else class="space-y-4 sm:space-y-6">
      <!-- User signups (area chart) -->
      <div class="card p-6">
        <div class="mb-6">
          <h2 class="text-base font-semibold text-[var(--color-text-primary)]">
            User Signups
          </h2>
          <p class="text-sm text-[var(--color-text-tertiary)] mt-0.5">
            New user registrations over time
          </p>
        </div>
        <ChartsAreaChart
          :labels="
            analyticsStore.signupsOverTime.map((d) => formatDateShort(d.date))
          "
          :datasets="[
            {
              label: 'Signups',
              data: analyticsStore.signupsOverTime.map((d) => d.signups),
              borderColor: 'rgb(99, 102, 241)',
              backgroundColor: 'rgba(99, 102, 241, 0.08)',
            },
          ]"
          :height="280"
        />
      </div>

      <div class="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <!-- Revenue by category (stacked bar) -->
        <div class="card p-6">
          <div class="mb-6">
            <h2
              class="text-base font-semibold text-[var(--color-text-primary)]"
            >
              Revenue by Category
            </h2>
            <p class="text-sm text-[var(--color-text-tertiary)] mt-0.5">
              Breakdown across product categories
            </p>
          </div>
          <ChartsBarChart
            :labels="categoryLabels"
            :datasets="categoryDatasets"
            :height="260"
          />
        </div>

        <!-- Top products (horizontal bar) -->
        <div class="card p-6">
          <div class="mb-6">
            <h2
              class="text-base font-semibold text-[var(--color-text-primary)]"
            >
              Top Products
            </h2>
            <p class="text-sm text-[var(--color-text-tertiary)] mt-0.5">
              Best selling products by volume
            </p>
          </div>
          <ChartsBarChart
            :labels="analyticsStore.topProducts.map((p) => p.name)"
            :datasets="[
              {
                label: 'Sales',
                data: analyticsStore.topProducts.map((p) => p.sales),
              },
            ]"
            :height="260"
            horizontal
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, computed } from "vue";
import { useAnalyticsStore } from "~/stores/analytics";
import { formatDateShort } from "~/utils/formatters";
import type { DateRange } from "~/types/analytics";

definePageMeta({
  middleware: "auth",
});

const analyticsStore = useAnalyticsStore();

const dateRanges: { label: string; value: DateRange }[] = [
  { label: "7 days", value: "7d" },
  { label: "30 days", value: "30d" },
  { label: "90 days", value: "90d" },
];

const categoryLabels = computed(() =>
  analyticsStore.revenueByCategory.map((c) => c.category),
);

const categoryColors = [
  "rgb(99, 102, 241)",
  "rgb(139, 92, 246)",
  "rgb(167, 139, 250)",
  "rgb(196, 181, 253)",
  "rgb(129, 140, 248)",
  "rgb(165, 180, 252)",
];

const categoryDatasets = computed(() =>
  analyticsStore.revenueByCategory.map((c, i) => ({
    label: c.category,
    data: c.revenue,
    backgroundColor: categoryColors[i % categoryColors.length],
  })),
);

function clearFilters() {
  analyticsStore.setDateRange("30d");
  analyticsStore.setCategory("All");
}

function getDateRangeLabel(range: DateRange): string {
  const labels: Record<DateRange, string> = {
    "7d": "Last 7 days",
    "30d": "Last 30 days",
    "90d": "Last 90 days",
    custom: "Custom range",
  };
  return labels[range];
}

onMounted(() => {
  analyticsStore.fetchData();
});
</script>
