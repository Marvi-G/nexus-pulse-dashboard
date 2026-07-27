<template>
  <div class="card p-6 animate-fade-in">
    <div class="flex items-start justify-between">
      <div class="space-y-3">
        <p class="text-sm font-medium text-[var(--color-text-secondary)]">{{ title }}</p>
        <p class="text-3xl font-semibold text-[var(--color-text-primary)] tracking-tight">{{ value }}</p>
        <div class="flex items-center gap-1.5">
          <span
            :class="[
              'inline-flex items-center gap-0.5 text-xs font-semibold',
              change >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-danger)]',
            ]"
          >
            <svg
              :class="['w-3.5 h-3.5', change < 0 ? 'rotate-180' : '']"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
            {{ formatPercent(change) }}
          </span>
          <span class="text-xs text-[var(--color-text-tertiary)]">{{ changeLabel }}</span>
        </div>
      </div>
      <div
        :class="[
          'flex items-center justify-center w-12 h-12 rounded-xl',
          iconBgClass,
        ]"
      >
        <div class="w-6 h-6" v-html="iconSvg" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatPercent } from '~/utils/formatters';

interface Props {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  icon: string;
}

const props = defineProps<Props>();

const iconSvg = computed(() => {
  const icons: Record<string, string> = {
    currency: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>',
    users: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>',
    orders: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>',
    conversion: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941"/></svg>',
  };
  return icons[props.icon] || icons.currency;
});

const iconBgClass = computed(() => {
  if (props.change >= 0) return 'bg-[var(--color-success-light)] text-[var(--color-success)]';
  return 'bg-[var(--color-danger-light)] text-[var(--color-danger)]';
});
</script>
