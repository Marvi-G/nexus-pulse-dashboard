<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :class="[
      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] focus:ring-opacity-40 focus:ring-offset-2 focus:ring-offset-[var(--color-bg-primary)]',
      modelValue ? 'bg-[var(--color-accent)]' : 'bg-[var(--color-bg-active)]',
    ]"
    @click="$emit('update:modelValue', !modelValue)"
  >
    <span
      :class="[
        'inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
        modelValue ? 'translate-x-6' : 'translate-x-1',
      ]"
    />
  </button>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
}

defineProps<Props>();

defineEmits<{
  'update:modelValue': [value: boolean];
}>();
</script>
