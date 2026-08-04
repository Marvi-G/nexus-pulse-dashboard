<template>
  <div class="min-h-screen bg-[var(--color-bg-primary)]">
    <LayoutSidebar
      :is-open="sidebarOpen"
      :collapsed="sidebarCollapsed"
      @close="sidebarOpen = false"
      @toggle-collapse="toggleSidebarCollapse"
    />

    <div
      :class="[
        'flex flex-col min-h-screen transition-all duration-300',
        sidebarCollapsed ? 'lg:pl-[70px]' : 'lg:pl-64',
      ]"
    >
      <LayoutHeader @toggle-sidebar="sidebarOpen = !sidebarOpen" />

      <main class="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
        <slot />
      </main>

      <LayoutFooter />
    </div>

    <LayoutBottomNav />
    <UiToast />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";

const { initTheme } = useTheme();
const sidebarOpen = ref(false);
const sidebarCollapsed = ref(false);

// Load collapsed state from localStorage
onMounted(() => {
  initTheme();
  const savedState = localStorage.getItem("sidebarCollapsed");
  if (savedState === "true") {
    sidebarCollapsed.value = true;
  }
});

function toggleSidebarCollapse() {
  sidebarCollapsed.value = !sidebarCollapsed.value;
  localStorage.setItem("sidebarCollapsed", sidebarCollapsed.value.toString());
}
</script>
