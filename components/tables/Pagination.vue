<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-3">
    <p class="text-sm text-[var(--color-text-tertiary)]">
      Showing <span class="font-medium text-[var(--color-text-secondary)]">{{ startItem }}</span>
      to <span class="font-medium text-[var(--color-text-secondary)]">{{ endItem }}</span>
      of <span class="font-medium text-[var(--color-text-secondary)]">{{ totalItems }}</span> results
    </p>

    <div class="flex items-center gap-1">
      <!-- Previous -->
      <button
        :disabled="!hasPrev"
        class="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        @click="$emit('page', currentPage - 1)"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>

      <!-- Page numbers -->
      <button
        v-for="page in visiblePages"
        :key="page"
        :class="[
          'w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-colors',
          page === currentPage
            ? 'bg-[var(--color-accent)] text-white'
            : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]',
        ]"
        @click="$emit('page', page)"
      >
        {{ page }}
      </button>

      <!-- Next -->
      <button
        :disabled="!hasNext"
        class="p-2 rounded-lg text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
        @click="$emit('page', currentPage + 1)"
      >
        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  startItem: number;
  endItem: number;
  visiblePages: number[];
  hasPrev: boolean;
  hasNext: boolean;
}

defineProps<Props>();

defineEmits<{
  page: [page: number];
}>();
</script>
