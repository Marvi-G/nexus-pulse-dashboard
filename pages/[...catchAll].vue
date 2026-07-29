<template>
  <div class="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fade-in px-4">
    <!-- 404 illustration -->
    <div class="relative mb-8">
      <div class="text-[8rem] font-bold text-[var(--color-bg-tertiary)] leading-none select-none">
        404
      </div>
      <div class="absolute inset-0 flex items-center justify-center">
        <svg class="w-20 h-20 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
    </div>

    <h1 class="text-2xl font-semibold text-[var(--color-text-primary)] tracking-tight mb-2">
      Page not found
    </h1>
    <p class="text-sm text-[var(--color-text-secondary)] max-w-sm mb-8">
      The page you're looking for doesn't exist or has been moved. Let's get you back on track.
    </p>

    <NuxtLink to="/" class="btn-primary inline-flex items-center gap-2">
      <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
      Back to Dashboard
    </NuxtLink>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: 'auth',
});
</script>
