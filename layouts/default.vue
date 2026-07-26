<template>
  <div class="min-h-screen bg-[var(--color-bg-primary)]">
    <LayoutSidebar :is-open="sidebarOpen" @close="sidebarOpen = false" />

    <div class="lg:pl-64 flex flex-col min-h-screen">
      <LayoutHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="flex-1 p-4 sm:p-6 lg:p-8">
        <slot />
      </main>

      <LayoutFooter />
    </div>

    <UiToast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

const { initTheme } = useTheme();
const sidebarOpen = ref(false);

onMounted(() => {
  initTheme();
});
</script>
