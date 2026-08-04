<template>
  <Teleport to="body">
    <div
      class="fixed bottom-6 right-6 left-6 sm:left-auto z-[60] flex flex-col gap-3 sm:max-w-md safe-bottom"
    >
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'flex items-start gap-3 px-5 py-4 rounded-2xl shadow-elevated border animate-slide-up',
            toastClasses(toast.type),
          ]"
        >
          <!-- Icon -->
          <div class="flex-shrink-0 mt-0.5">
            <svg
              v-if="toast.type === 'success'"
              class="w-5 h-5 text-[var(--color-success)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <svg
              v-else-if="toast.type === 'error'"
              class="w-5 h-5 text-[var(--color-danger)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <svg
              v-else-if="toast.type === 'warning'"
              class="w-5 h-5 text-[var(--color-warning)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <svg
              v-else
              class="w-5 h-5 text-[var(--color-accent)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2.5"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <!-- Message -->
          <p
            class="text-sm font-medium text-[var(--color-text-primary)] flex-1 leading-relaxed"
          >
            {{ toast.message }}
          </p>

          <!-- Close -->
          <button
            class="flex-shrink-0 p-1 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-all duration-200"
            @click="removeToast(toast.id)"
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
          </button>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useSettingsStore } from "~/stores/settings";

const settingsStore = useSettingsStore();
const toasts = computed(() => settingsStore.toasts);

function removeToast(id: number) {
  settingsStore.removeToast(id);
}

function toastClasses(type: string) {
  const map: Record<string, string> = {
    success: "bg-[var(--color-bg-card)] border-[var(--color-border-primary)]",
    error:
      "bg-[var(--color-bg-card)] border-[var(--color-danger)] border-opacity-30",
    warning:
      "bg-[var(--color-bg-card)] border-[var(--color-warning)] border-opacity-30",
    info: "bg-[var(--color-bg-card)] border-[var(--color-accent)] border-opacity-30",
  };
  return map[type] || map.success;
}
</script>

<style scoped>
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.toast-enter-active {
  transition: all 400ms cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-leave-active {
  transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
.toast-leave-to {
  opacity: 0;
  transform: translateX(40px) scale(0.95);
}
.toast-move {
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
</style>
