<template>
  <div class="flex flex-col items-center justify-center py-16 px-6">
    <!-- Illustration -->
    <div class="mb-6">
      <svg
        class="w-32 h-32 text-[var(--color-text-tertiary)]"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        stroke-width="1"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>

    <!-- Title -->
    <h3 class="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
      {{ title }}
    </h3>

    <!-- Description -->
    <p
      class="text-sm text-[var(--color-text-secondary)] text-center max-w-md mb-6"
    >
      {{ description }}
    </p>

    <!-- Action Button (optional) -->
    <button v-if="actionText" class="btn-primary" @click="$emit('action')">
      {{ actionText }}
    </button>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  description?: string;
  actionText?: string;
}

withDefaults(defineProps<Props>(), {
  title: "No data found",
  description: "There are no items to display at the moment.",
  actionText: "",
});

defineEmits<{
  action: [];
}>();
</script>
