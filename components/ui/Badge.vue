<template>
  <span
    :class="[
      'inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg transition-colors',
      variantClasses,
    ]"
  >
    <span v-if="variant === 'active'" class="w-1.5 h-1.5 rounded-full bg-emerald-500" />
    <span v-else-if="variant === 'pending'" class="w-1.5 h-1.5 rounded-full bg-amber-500" />
    <span v-else-if="variant === 'inactive'" class="w-1.5 h-1.5 rounded-full bg-slate-400" />
    {{ label }}
  </span>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  variant?: 'active' | 'inactive' | 'pending' | 'default' | 'danger' | 'info';
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'default',
});

const variantClasses = computed(() => {
  const map: Record<string, string> = {
    active: 'bg-[var(--color-success-light)] text-[var(--color-success)]',
    inactive: 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-tertiary)]',
    pending: 'bg-[var(--color-warning-light)] text-[var(--color-warning)]',
    default: 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-secondary)]',
    danger: 'bg-[var(--color-danger-light)] text-[var(--color-danger)]',
    info: 'bg-[var(--color-accent-light)] text-[var(--color-accent)]',
  };
  return map[props.variant] || map.default;
});
</script>
