<template>
  <div class="min-h-screen flex items-center justify-center bg-[var(--color-bg-secondary)] p-4">
    <UiToast />
    <slot />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

const { initTheme } = useTheme();

onMounted(() => {
  initTheme();
});
</script>
