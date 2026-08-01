<template>
  <div class="card">
    <div class="flex items-center justify-between p-6 pb-4">
      <h3 class="text-lg font-semibold text-[var(--color-text-primary)]">
        Recent Activity
      </h3>
      <button class="btn-ghost text-sm">View All</button>
    </div>

    <div class="divide-y divide-[var(--color-border-primary)]">
      <div
        v-for="activity in activities"
        :key="activity.id"
        class="flex items-start gap-4 p-6 hover:bg-[var(--color-bg-secondary)] transition-colors"
      >
        <!-- Avatar -->
        <div
          class="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white"
          :class="getAvatarColor(activity.user)"
        >
          {{ getInitials(activity.user) }}
        </div>

        <!-- Content -->
        <div class="flex-1 min-w-0">
          <p class="text-sm text-[var(--color-text-primary)]">
            <span class="font-semibold">{{ activity.user }}</span>
            {{ activity.action }}
          </p>
          <p class="text-xs text-[var(--color-text-tertiary)] mt-1">
            {{ formatTimeAgo(activity.timestamp) }}
          </p>
        </div>

        <!-- Type Badge -->
        <div
          class="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium"
          :class="getTypeBadgeClass(activity.type)"
        >
          {{ activity.type }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Activity {
  id: number;
  user: string;
  action: string;
  timestamp: string;
  type: "create" | "update" | "delete" | "login";
}

const activities: Activity[] = [
  {
    id: 1,
    user: "Emma Smith",
    action: "created a new order #1234",
    timestamp: "2024-01-29T10:30:00Z",
    type: "create",
  },
  {
    id: 2,
    user: "John Doe",
    action: "updated user profile settings",
    timestamp: "2024-01-29T09:15:00Z",
    type: "update",
  },
  {
    id: 3,
    user: "Sarah Johnson",
    action: 'deleted product "Wireless Headphones"',
    timestamp: "2024-01-29T08:45:00Z",
    type: "delete",
  },
  {
    id: 4,
    user: "Mike Wilson",
    action: "logged in from new device",
    timestamp: "2024-01-29T08:00:00Z",
    type: "login",
  },
  {
    id: 5,
    user: "Lisa Brown",
    action: "created 3 new products",
    timestamp: "2024-01-28T16:20:00Z",
    type: "create",
  },
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
}

function getAvatarColor(name: string): string {
  const colors = [
    "bg-blue-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-red-500",
    "bg-cyan-500",
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
}

function getTypeBadgeClass(type: string): string {
  const classes: Record<string, string> = {
    create:
      "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
    update: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
    delete: "bg-red-100 text-red-700 dark:bg-red-900/20 dark:text-red-400",
    login:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
  };
  return classes[type] || classes.update;
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

  return past.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
</script>
