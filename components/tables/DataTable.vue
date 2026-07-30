<template>
  <div class="card overflow-hidden">
    <!-- Search bar -->
    <div class="p-4 sm:p-6 border-b border-[var(--color-border-primary)]">
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
      >
        <div class="relative flex-1 max-w-sm">
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
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <input
            type="text"
            :value="search"
            placeholder="Search by name or email..."
            class="input-base pl-9"
            @input="$emit('search', ($event.target as HTMLInputElement).value)"
          />
        </div>
        <p class="text-sm text-[var(--color-text-tertiary)]">
          {{ totalFiltered }} result{{ totalFiltered !== 1 ? "s" : "" }}
        </p>
      </div>
    </div>

    <!-- Desktop table -->
    <div class="hidden md:block overflow-x-auto">
      <table class="w-full">
        <thead>
          <tr class="border-b border-[var(--color-border-primary)]">
            <th
              v-for="col in columns"
              :key="col.key"
              class="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-tertiary)] uppercase tracking-wider cursor-pointer hover:text-[var(--color-text-secondary)] transition-colors select-none"
              @click="col.sortable !== false && $emit('sort', col.key)"
            >
              <div class="flex items-center gap-1.5">
                {{ col.label }}
                <svg
                  v-if="sortKey === col.key && sortDir"
                  :class="[
                    'w-3.5 h-3.5 transition-transform',
                    sortDir === 'desc' ? 'rotate-180' : '',
                  ]"
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
              </div>
            </th>
          </tr>
        </thead>
        <tbody class="divide-y divide-[var(--color-border-secondary)]">
          <!-- Skeleton loading rows -->
          <template v-if="loading">
            <tr v-for="i in 10" :key="'skeleton-' + i" class="animate-pulse">
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 rounded-lg skeleton" />
                  <div class="skeleton h-4 w-32" />
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="skeleton h-4 w-40" />
              </td>
              <td class="px-6 py-4">
                <div class="skeleton h-6 w-16" />
              </td>
              <td class="px-6 py-4">
                <div class="skeleton h-6 w-20" />
              </td>
              <td class="px-6 py-4">
                <div class="skeleton h-4 w-24" />
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-2">
                  <div class="skeleton h-7 w-7 rounded-lg" />
                  <div class="skeleton h-7 w-7 rounded-lg" />
                </div>
              </td>
            </tr>
          </template>

          <!-- Actual data rows -->
          <tr
            v-else
            v-for="row in rows"
            :key="row.id"
            class="hover:bg-[var(--color-bg-hover)] transition-colors"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-purple-500 flex items-center justify-center text-white text-xs font-semibold"
                >
                  {{ getInitials(row.name) }}
                </div>
                <span
                  class="text-sm font-medium text-[var(--color-text-primary)]"
                  >{{ row.name }}</span
                >
              </div>
            </td>
            <td class="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
              {{ row.email }}
            </td>
            <td class="px-6 py-4">
              <UiBadge :label="row.role" variant="info" />
            </td>
            <td class="px-6 py-4">
              <UiBadge
                :label="row.status"
                :variant="
                  row.status === 'Active'
                    ? 'active'
                    : row.status === 'Pending'
                      ? 'pending'
                      : 'inactive'
                "
              />
            </td>
            <td class="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
              {{ formatDate(row.joinDate) }}
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-1">
                <button
                  class="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-colors"
                  title="Edit"
                  @click="$emit('edit', row)"
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
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </button>
                <button
                  class="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-colors"
                  title="Delete"
                  @click="$emit('delete', row)"
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
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Mobile card list -->
    <div class="md:hidden divide-y divide-[var(--color-border-secondary)]">
      <!-- Skeleton loading cards -->
      <template v-if="loading">
        <div
          v-for="i in 10"
          :key="'skeleton-mobile-' + i"
          class="p-4 space-y-3 animate-pulse"
        >
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl skeleton" />
            <div class="flex-1 space-y-2">
              <div class="skeleton h-4 w-32" />
              <div class="skeleton h-3 w-40" />
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="skeleton h-6 w-16" />
            <div class="skeleton h-6 w-20" />
            <div class="skeleton h-4 w-24 ml-auto" />
          </div>
          <div class="flex items-center gap-2 pt-1">
            <div class="skeleton h-9 w-16 rounded-lg" />
            <div class="skeleton h-9 w-16 rounded-lg" />
          </div>
        </div>
      </template>

      <!-- Actual data cards -->
      <template v-else>
        <div v-for="row in rows" :key="row.id" class="p-4 space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-accent)] to-purple-500 flex items-center justify-center text-white text-sm font-semibold"
              >
                {{ getInitials(row.name) }}
              </div>
              <div>
                <p class="text-sm font-medium text-[var(--color-text-primary)]">
                  {{ row.name }}
                </p>
                <p class="text-xs text-[var(--color-text-tertiary)]">
                  {{ row.email }}
                </p>
              </div>
            </div>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <UiBadge :label="row.role" variant="info" />
            <UiBadge
              :label="row.status"
              :variant="
                row.status === 'Active'
                  ? 'active'
                  : row.status === 'Pending'
                    ? 'pending'
                    : 'inactive'
              "
            />
            <span class="text-xs text-[var(--color-text-tertiary)]">{{
              formatDate(row.joinDate)
            }}</span>
          </div>
          <div class="flex items-center gap-2 pt-1">
            <UiButton size="sm" variant="secondary" @click="$emit('edit', row)"
              >Edit</UiButton
            >
            <UiButton size="sm" variant="danger" @click="$emit('delete', row)"
              >Delete</UiButton
            >
          </div>
        </div>
      </template>
    </div>

    <!-- Empty state -->
    <div v-if="!loading && rows.length === 0" class="p-12 text-center">
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
          d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"
        />
      </svg>
      <p class="mt-3 text-sm text-[var(--color-text-secondary)]">
        No users found
      </p>
      <p class="text-xs text-[var(--color-text-tertiary)]">
        Try adjusting your search query
      </p>
    </div>

    <!-- Pagination footer -->
    <div
      v-if="rows.length > 0"
      class="px-4 sm:px-6 py-4 border-t border-[var(--color-border-primary)]"
    >
      <slot name="pagination" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from "~/types/user";
import { formatDate } from "~/utils/formatters";

interface Column {
  key: keyof User;
  label: string;
  sortable?: boolean;
}

interface Props {
  rows: User[];
  columns: Column[];
  search: string;
  totalFiltered: number;
  sortKey: keyof User | null;
  sortDir: "asc" | "desc" | null;
  loading?: boolean;
}

defineProps<Props>();

defineEmits<{
  search: [value: string];
  sort: [key: keyof User];
  edit: [user: User];
  delete: [user: User];
}>();

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}
</script>
