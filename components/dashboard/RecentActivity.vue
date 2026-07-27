<template>
  <div class="card p-6">
    <h3 class="text-base font-semibold text-[var(--color-text-primary)] mb-4">Recent Activity</h3>
    <div class="space-y-4">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="flex items-start gap-3"
      >
        <div
          :class="[
            'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold',
            activity.color,
          ]"
        >
          {{ activity.initials }}
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm text-[var(--color-text-primary)]">
            <span class="font-medium">{{ activity.user }}</span>
            {{ activity.action }}
          </p>
          <p class="text-xs text-[var(--color-text-tertiary)] mt-0.5">{{ activity.time }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const activities = [
  { id: 1, user: 'Emma Smith', action: 'placed a new order #1234', time: '2 minutes ago', initials: 'ES', color: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' },
  { id: 2, user: 'Liam Johnson', action: 'updated their profile settings', time: '15 minutes ago', initials: 'LJ', color: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400' },
  { id: 3, user: 'Olivia Brown', action: 'submitted a support ticket', time: '1 hour ago', initials: 'OB', color: 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400' },
  { id: 4, user: 'Noah Davis', action: 'left a 5-star review', time: '2 hours ago', initials: 'ND', color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400' },
  { id: 5, user: 'Ava Wilson', action: 'completed onboarding flow', time: '3 hours ago', initials: 'AW', color: 'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400' },
];
</script>
