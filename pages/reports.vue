<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">Reports</h1>
        <p class="page-subtitle">Generate and manage your reports</p>
      </div>
      <UiButton variant="primary" @click="showGenerateModal = true">
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
            d="M12 4v16m8-8H4"
          />
        </svg>
        Generate Report
      </UiButton>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div
        class="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4"
      >
        <!-- Status tabs -->
        <div
          class="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-bg-tertiary)]"
        >
          <button
            v-for="tab in statusTabs"
            :key="tab.value"
            :class="[
              'px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all',
              reportsStore.statusFilter === tab.value
                ? 'bg-[var(--color-bg-card)] text-[var(--color-text-primary)] shadow-soft'
                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]',
            ]"
            @click="reportsStore.setStatusFilter(tab.value)"
          >
            {{ tab.label }}
            <span
              v-if="reportsStore.counts[tab.value] > 0"
              class="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-[var(--color-bg-tertiary)]"
            >
              {{ reportsStore.counts[tab.value] }}
            </span>
          </button>
        </div>

        <div class="flex items-center gap-3 w-full lg:w-auto">
          <!-- Type filter -->
          <div class="relative flex-1 lg:flex-initial lg:w-48">
            <select
              :value="reportsStore.typeFilter"
              class="input-base pl-10 pr-10 appearance-none cursor-pointer"
              @change="
                reportsStore.setTypeFilter(
                  ($event.target as HTMLSelectElement).value as any,
                )
              "
            >
              <option value="all">All Types</option>
              <option value="sales">Sales</option>
              <option value="analytics">Analytics</option>
              <option value="users">Users</option>
              <option value="financial">Financial</option>
              <option value="inventory">Inventory</option>
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
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
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>

          <!-- Search -->
          <div class="relative flex-1 lg:flex-initial lg:w-64">
            <input
              type="text"
              :value="reportsStore.searchQuery"
              placeholder="Search reports..."
              class="input-base pl-10"
              @input="
                reportsStore.setSearchQuery(
                  ($event.target as HTMLInputElement).value,
                )
              "
            />
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reports table -->
    <div class="card overflow-hidden">
      <div
        v-if="reportsStore.filteredReports.length === 0"
        class="p-12 text-center"
      >
        <svg
          class="w-12 h-12 mx-auto text-[var(--color-text-tertiary)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <p class="mt-3 text-sm text-[var(--color-text-secondary)]">
          No reports found
        </p>
        <p class="text-xs text-[var(--color-text-tertiary)]">
          Try adjusting your filters or generate a new report
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-[var(--color-border-primary)]">
              <th
                class="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider"
              >
                Name
              </th>
              <th
                class="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider"
              >
                Type
              </th>
              <th
                class="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider"
              >
                Created
              </th>
              <th
                class="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider"
              >
                Size
              </th>
              <th
                class="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider"
              >
                Generated By
              </th>
              <th
                class="px-6 py-3.5 text-right text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border-secondary)]">
            <tr
              v-for="report in reportsStore.filteredReports"
              :key="report.id"
              class="hover:bg-[var(--color-bg-hover)] transition-colors"
            >
              <!-- Name -->
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div
                    :class="[
                      'flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center',
                      getTypeIconClass(report.type),
                    ]"
                  >
                    <div v-html="getTypeIcon(report.type)" class="w-5 h-5" />
                  </div>
                  <div class="flex-1 min-w-0">
                    <p
                      class="text-sm font-medium text-[var(--color-text-primary)] truncate"
                    >
                      {{ report.name }}
                    </p>
                  </div>
                </div>
              </td>

              <!-- Type -->
              <td class="px-6 py-4">
                <span
                  class="text-sm text-[var(--color-text-secondary)] capitalize"
                >
                  {{ report.type }}
                </span>
              </td>

              <!-- Status -->
              <td class="px-6 py-4">
                <div
                  :class="[
                    'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                    getStatusClass(report.status),
                  ]"
                >
                  <div :class="getStatusDotClass(report.status)" />
                  {{ report.status }}
                </div>
              </td>

              <!-- Created -->
              <td class="px-6 py-4">
                <span class="text-sm text-[var(--color-text-secondary)]">
                  {{ formatDate(report.createdAt) }}
                </span>
              </td>

              <!-- Size -->
              <td class="px-6 py-4">
                <span class="text-sm text-[var(--color-text-secondary)]">
                  {{ report.size }}
                </span>
              </td>

              <!-- Generated By -->
              <td class="px-6 py-4">
                <span class="text-sm text-[var(--color-text-secondary)]">
                  {{ report.generatedBy }}
                </span>
              </td>

              <!-- Actions -->
              <td class="px-6 py-4">
                <div class="flex items-center justify-end gap-1">
                  <!-- Download (only for completed) -->
                  <button
                    v-if="report.status === 'completed'"
                    class="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-colors"
                    title="Download"
                    @click="handleDownload(report)"
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </button>

                  <!-- Retry (only for failed) -->
                  <button
                    v-if="report.status === 'failed'"
                    class="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-warning)] hover:bg-[var(--color-warning-light)] transition-colors"
                    title="Retry"
                    @click="reportsStore.retryReport(report.id)"
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
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </button>

                  <!-- Delete -->
                  <button
                    class="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-colors"
                    title="Delete"
                    @click="reportsStore.deleteReport(report.id)"
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
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Generate Report Modal -->
    <UiModal v-model="showGenerateModal" title="Generate New Report">
      <form @submit.prevent="handleGenerateReport" class="space-y-4">
        <UiInput
          v-model="newReport.name"
          label="Report Name"
          placeholder="e.g., Q1 Sales Report 2024"
          required
        />

        <div class="space-y-1.5">
          <label
            class="block text-sm font-medium text-[var(--color-text-secondary)]"
            >Report Type</label
          >
          <select v-model="newReport.type" class="input-base">
            <option value="sales">Sales</option>
            <option value="analytics">Analytics</option>
            <option value="users">Users</option>
            <option value="financial">Financial</option>
            <option value="inventory">Inventory</option>
          </select>
        </div>
      </form>

      <template #footer>
        <UiButton variant="secondary" @click="showGenerateModal = false"
          >Cancel</UiButton
        >
        <UiButton variant="primary" @click="handleGenerateReport"
          >Generate</UiButton
        >
      </template>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { useReportsStore } from "~/stores/reports";
import { useSettingsStore } from "~/stores/settings";
import type { ReportStatus, ReportType } from "~/stores/reports";

definePageMeta({
  middleware: "auth",
});

const reportsStore = useReportsStore();
const settingsStore = useSettingsStore();

const showGenerateModal = ref(false);
const newReport = reactive({
  name: "",
  type: "sales" as ReportType,
});

const statusTabs = [
  { label: "All", value: "all" as const },
  { label: "Pending", value: "pending" as const },
  { label: "Completed", value: "completed" as const },
  { label: "Failed", value: "failed" as const },
];

function getTypeIcon(type: ReportType): string {
  const icons: Record<ReportType, string> = {
    sales:
      '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>',
    analytics:
      '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>',
    users:
      '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>',
    financial:
      '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>',
    inventory:
      '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>',
  };
  return icons[type];
}

function getTypeIconClass(type: ReportType): string {
  const classes: Record<ReportType, string> = {
    sales:
      "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    analytics:
      "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    users:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
    financial:
      "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    inventory:
      "bg-cyan-100 text-cyan-600 dark:bg-cyan-900/20 dark:text-cyan-400",
  };
  return classes[type];
}

function getStatusClass(status: ReportStatus): string {
  const classes: Record<ReportStatus, string> = {
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    completed:
      "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    failed: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
  };
  return classes[status];
}

function getStatusDotClass(status: ReportStatus): string {
  const classes: Record<ReportStatus, string> = {
    pending: "w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse",
    completed: "w-1.5 h-1.5 rounded-full bg-green-500",
    failed: "w-1.5 h-1.5 rounded-full bg-red-500",
  };
  return classes[status];
}

function formatDate(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function handleDownload(report: any) {
  settingsStore.addToast(`Downloading ${report.name}...`, "info");

  // Simulate download
  setTimeout(() => {
    settingsStore.addToast(`${report.name} downloaded successfully`, "success");
  }, 1000);
}

function handleGenerateReport() {
  if (!newReport.name.trim()) {
    settingsStore.addToast("Please enter a report name", "error");
    return;
  }

  const newReportData = {
    id: Date.now(),
    name: newReport.name,
    type: newReport.type,
    status: "pending" as ReportStatus,
    createdAt: new Date().toISOString(),
    size: "-",
    generatedBy: "You",
  };

  reportsStore.reports.unshift(newReportData);

  settingsStore.addToast("Report generation started", "success");

  // Simulate completion after 3 seconds
  setTimeout(() => {
    const report = reportsStore.reports.find((r) => r.id === newReportData.id);
    if (report) {
      report.status = "completed";
      report.completedAt = new Date().toISOString();
      report.size = "2.1 MB";
      settingsStore.addToast("Report generated successfully", "success");
    }
  }, 3000);

  showGenerateModal.value = false;
  newReport.name = "";
  newReport.type = "sales";
}
</script>
