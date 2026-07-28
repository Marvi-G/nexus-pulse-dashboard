<template>
  <Teleport to="body">
    <div class="fixed bottom-6 right-6 z-[60] flex flex-col gap-2">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'flex items-center gap-3 px-4 py-3 rounded-xl shadow-elevated border min-w-[280px] max-w-[400px] animate-slide-up',
            toastClasses(toast.type),
          ]"
        >
          <!-- Icon -->
          <div class="flex-shrink-0">
            <svg v-if="toast.type === 'success'" class="w-5 h-5 text-[var(--color-success)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
            </svg>
            <svg v-else-if="toast.type === 'error'" class="w-5 h-5 text-[var(--color-danger)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
            <svg v-else class="w-5 h-5 text-[var(--color-accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <!-- Message -->
          <p class="text-sm font-medium text-[var(--color-text-primary)] flex-1">{{ toast.message }}</p>

          <!-- Close -->
          <button
            class="flex-shrink-0 p-0.5 rounded text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] transition-colors"
            @click="removeToast(toast.id)"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useSettingsStore } from '~/stores/settings';

const settingsStore = useSettingsStore();
const toasts = computed(() => settingsStore.toasts);

function removeToast(id: number) {
  settingsStore.removeToast(id);
}

function toastClasses(type: string) {
  const map: Record<string, string> = {
    success: 'bg-[var(--color-bg-card)] border-[var(--color-border-primary)]',
    error: 'bg-[var(--color-bg-card)] border-[var(--color-danger)] border-opacity-30',
    info: 'bg-[var(--color-bg-card)] border-[var(--color-accent)] border-opacity-30',
  };
  return map[type] || map.success;
}
</script>

<style scoped>
.toast-enter-active {
  transition: all 300ms ease-out;
}
.toast-leave-active {
  transition: all 200ms ease-in;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(20px);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(20px);
}
</style>
