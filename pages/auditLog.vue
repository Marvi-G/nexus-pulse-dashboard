<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Page header -->
    <div>
      <h1 class="page-title">Audit Log</h1>
      <p class="page-subtitle">Track system activities and user actions</p>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div class="flex flex-col gap-4">
        <!-- Filter Row -->
        <div
          class="flex flex-col lg:flex-row items-start lg:items-center gap-4"
        >
          <!-- Date range -->
          <div
            class="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-bg-tertiary)]"
          >
            <button
              v-for="range in dateRanges"
              :key="range.value"
              :class="[
                'px-4 py-2 text-sm font-medium rounded-lg transition-all',
                auditLogStore.dateRange === range.value
                  ? 'bg-[var(--color-bg-card)] text-[var(--color-text-primary)] shadow-soft'
                  : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]',
              ]"
              @click="auditLogStore.setDateRange(range.value)"
            >
              {{ range.label }}
            </button>
          </div>

          <!-- User filter -->
          <div class="relative flex-1 max-w-xs">
            <select
              :value="auditLogStore.userFilter"
              class="input-base pl-10 pr-10 appearance-none cursor-pointer"
              @change="
                auditLogStore.setUserFilter(
                  ($event.target as HTMLSelectElement).value,
                )
              "
            >
              <option
                v-for="user in auditLogStore.uniqueUsers"
                :key="user"
                :value="user"
              >
                {{ user === "all" ? "All Users" : user }}
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
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
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

          <!-- Action type filter -->
          <div class="relative flex-1 max-w-xs">
            <select
              :value="auditLogStore.actionFilter"
              class="input-base pl-10 pr-10 appearance-none cursor-pointer"
              @change="
                auditLogStore.setActionFilter(
                  ($event.target as HTMLSelectElement).value as any,
                )
              "
            >
              <option value="all">All Actions</option>
              <option value="login">Login</option>
              <option value="create">Create</option>
              <option value="update">Update</option>
              <option value="delete">Delete</option>
              <option value="export">Export</option>
              <option value="system">System</option>
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
                  d="M13 10V3L4 14h7v7l9-11h-7z"
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
        </div>

        <!-- Search and Clear -->
        <div class="flex items-center gap-3">
          <div class="relative flex-1">
            <input
              type="text"
              :value="auditLogStore.searchQuery"
              placeholder="Search by user, resource, details, or IP..."
              class="input-base pl-10"
              @input="
                auditLogStore.setSearchQuery(
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

          <button
            v-if="hasActiveFilters"
            class="btn-ghost text-sm flex items-center gap-2"
            @click="auditLogStore.clearFilters()"
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
        <div v-if="hasActiveFilters" class="flex flex-wrap gap-2">
          <div
            v-if="auditLogStore.dateRange !== 'all'"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] text-sm font-medium"
          >
            <span>{{ getDateRangeLabel(auditLogStore.dateRange) }}</span>
            <button
              @click="auditLogStore.setDateRange('all')"
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
            v-if="auditLogStore.userFilter !== 'all'"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] text-sm font-medium"
          >
            <span>{{ auditLogStore.userFilter }}</span>
            <button
              @click="auditLogStore.setUserFilter('all')"
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
            v-if="auditLogStore.actionFilter !== 'all'"
            class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-accent-light)] text-[var(--color-accent)] text-sm font-medium"
          >
            <span class="capitalize">{{ auditLogStore.actionFilter }}</span>
            <button
              @click="auditLogStore.setActionFilter('all')"
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

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-[var(--color-text-secondary)]">
              Total Events
            </p>
            <p class="text-2xl font-bold text-[var(--color-text-primary)] mt-1">
              {{ auditLogStore.counts.total }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/20 flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-blue-600 dark:text-blue-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-[var(--color-text-secondary)]">Successful</p>
            <p class="text-2xl font-bold text-[var(--color-success)] mt-1">
              {{ auditLogStore.counts.success }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/20 flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-green-600 dark:text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
      <div class="card p-4">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-[var(--color-text-secondary)]">Failed</p>
            <p class="text-2xl font-bold text-[var(--color-danger)] mt-1">
              {{ auditLogStore.counts.failed }}
            </p>
          </div>
          <div
            class="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/20 flex items-center justify-center"
          >
            <svg
              class="w-5 h-5 text-red-600 dark:text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <!-- Audit Log Table -->
    <div class="card overflow-hidden">
      <div
        v-if="auditLogStore.filteredLogs.length === 0"
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
          No audit logs found
        </p>
        <p class="text-xs text-[var(--color-text-tertiary)]">
          Try adjusting your filters
        </p>
      </div>

      <div v-else class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-[var(--color-border-primary)]">
              <th
                class="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider w-8"
              ></th>
              <th
                class="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider"
              >
                Timestamp
              </th>
              <th
                class="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider"
              >
                User
              </th>
              <th
                class="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider"
              >
                Action
              </th>
              <th
                class="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider"
              >
                Resource
              </th>
              <th
                class="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider"
              >
                Status
              </th>
              <th
                class="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider"
              >
                IP Address
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-[var(--color-border-secondary)]">
            <template v-for="log in auditLogStore.filteredLogs" :key="log.id">
              <tr
                class="hover:bg-[var(--color-bg-hover)] transition-colors cursor-pointer"
                @click="toggleExpanded(log.id)"
              >
                <td class="px-6 py-4">
                  <svg
                    :class="[
                      'w-4 h-4 text-[var(--color-text-tertiary)] transition-transform',
                      expandedRows.has(log.id) ? 'rotate-90' : '',
                    ]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-[var(--color-text-secondary)]">
                    {{ formatTimestamp(log.timestamp) }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div class="flex items-center gap-2">
                    <div
                      :class="[
                        'w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold text-white',
                        getUserColor(log.user),
                      ]"
                    >
                      {{ getInitials(log.user) }}
                    </div>
                    <span
                      class="text-sm font-medium text-[var(--color-text-primary)]"
                    >
                      {{ log.user }}
                    </span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <div
                    :class="[
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                      getActionClass(log.action),
                    ]"
                  >
                    <div
                      v-html="getActionIcon(log.action)"
                      class="w-3.5 h-3.5"
                    />
                    <span class="capitalize">{{ log.action }}</span>
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span class="text-sm text-[var(--color-text-secondary)]">
                    {{ log.resource }}
                  </span>
                </td>
                <td class="px-6 py-4">
                  <div
                    :class="[
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                      getStatusClass(log.status),
                    ]"
                  >
                    <div :class="getStatusDotClass(log.status)" />
                    {{ log.status }}
                  </div>
                </td>
                <td class="px-6 py-4">
                  <span
                    class="text-sm text-[var(--color-text-secondary)] font-mono"
                  >
                    {{ log.ipAddress }}
                  </span>
                </td>
              </tr>

              <!-- Expanded Details Row -->
              <tr
                v-if="expandedRows.has(log.id)"
                class="bg-[var(--color-bg-secondary)]"
              >
                <td colspan="7" class="px-6 py-4">
                  <div class="pl-12 space-y-3">
                    <div>
                      <p
                        class="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-1"
                      >
                        Details
                      </p>
                      <p class="text-sm text-[var(--color-text-primary)]">
                        {{ log.details }}
                      </p>
                    </div>

                    <div
                      v-if="
                        log.metadata && Object.keys(log.metadata).length > 0
                      "
                    >
                      <p
                        class="text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider mb-2"
                      >
                        Metadata
                      </p>
                      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div
                          v-for="(value, key) in log.metadata"
                          :key="key"
                          class="bg-[var(--color-bg-card)] rounded-lg p-3"
                        >
                          <p
                            class="text-xs text-[var(--color-text-tertiary)] capitalize mb-1"
                          >
                            {{ formatKey(key as string) }}
                          </p>
                          <p
                            class="text-sm font-medium text-[var(--color-text-primary)]"
                          >
                            {{ formatValue(value) }}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useAuditLogStore } from "~/stores/auditLog";
import type { AuditActionType } from "~/stores/auditLog";

definePageMeta({
  middleware: "auth",
});

const auditLogStore = useAuditLogStore();
const expandedRows = ref<Set<number>>(new Set());

const dateRanges = [
  { label: "Today", value: "today" as const },
  { label: "Last 7 days", value: "week" as const },
  { label: "Last 30 days", value: "month" as const },
  { label: "All time", value: "all" as const },
];

const hasActiveFilters = computed(() => {
  return (
    auditLogStore.dateRange !== "all" ||
    auditLogStore.userFilter !== "all" ||
    auditLogStore.actionFilter !== "all" ||
    auditLogStore.searchQuery !== ""
  );
});

function toggleExpanded(id: number) {
  if (expandedRows.value.has(id)) {
    expandedRows.value.delete(id);
  } else {
    expandedRows.value.add(id);
  }
}

function getDateRangeLabel(range: "today" | "week" | "month" | "all"): string {
  const labels: Record<string, string> = {
    today: "Today",
    week: "Last 7 days",
    month: "Last 30 days",
    all: "All time",
  };
  return labels[range];
}

function formatTimestamp(timestamp: string): string {
  const date = new Date(timestamp);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getInitials(name: string): string {
  if (name === "System") return "S";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getUserColor(user: string): string {
  if (user === "System") return "bg-gray-500";
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-cyan-500",
  ];
  const index = user.charCodeAt(0) % colors.length;
  return colors[index];
}

function getActionIcon(action: AuditActionType): string {
  const icons: Record<AuditActionType, string> = {
    login:
      '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>',
    create:
      '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4" /></svg>',
    update:
      '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>',
    delete:
      '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>',
    export:
      '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>',
    system:
      '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
  };
  return icons[action];
}

function getActionClass(action: AuditActionType): string {
  const classes: Record<AuditActionType, string> = {
    login: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    create:
      "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    update:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
    delete: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    export:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
    system: "bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400",
  };
  return classes[action];
}

function getStatusClass(status: "success" | "failed"): string {
  return status === "success"
    ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400"
    : "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400";
}

function getStatusDotClass(status: "success" | "failed"): string {
  return status === "success"
    ? "w-1.5 h-1.5 rounded-full bg-green-500"
    : "w-1.5 h-1.5 rounded-full bg-red-500";
}

function formatKey(key: string): string {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase());
}

function formatValue(value: any): string {
  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return String(value);
}
</script>
