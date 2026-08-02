<template>
  <div class="card p-6">
    <div class="flex items-center justify-between mb-4">
      <h3 class="text-base font-semibold text-[var(--color-text-primary)]">
        Team Online
      </h3>
      <span class="text-sm text-[var(--color-text-tertiary)]"
        >{{ onlineUsers.length }} active</span
      >
    </div>

    <div class="space-y-3">
      <div
        v-for="user in onlineUsers"
        :key="user.id"
        class="flex items-center gap-3 p-2 rounded-lg hover:bg-[var(--color-bg-secondary)] transition-colors"
      >
        <!-- Avatar with status indicator -->
        <div class="relative">
          <div
            class="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold text-white"
            :class="getAvatarColor(user.name)"
          >
            {{ getInitials(user.name) }}
          </div>
          <!-- Online indicator -->
          <div
            class="absolute bottom-0 right-0 w-3 h-3 bg-[var(--color-success)] border-2 border-[var(--color-bg-card)] rounded-full"
          ></div>
        </div>

        <!-- User info -->
        <div class="flex-1 min-w-0">
          <p
            class="text-sm font-medium text-[var(--color-text-primary)] truncate"
          >
            {{ user.name }}
          </p>
          <p class="text-xs text-[var(--color-text-tertiary)] truncate">
            {{ user.role }}
          </p>
        </div>

        <!-- Last active -->
        <div class="text-xs text-[var(--color-text-tertiary)]">
          {{ formatLastActive(user.lastActive) }}
        </div>
      </div>
    </div>

    <!-- Show more button if there are more users -->
    <button
      v-if="totalOnline > onlineUsers.length"
      class="w-full mt-4 py-2 text-sm text-[var(--color-accent)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
      @click="showAll = !showAll"
    >
      {{ showAll ? "Show less" : `+${totalOnline - onlineUsers.length} more` }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

interface OnlineUser {
  id: number;
  name: string;
  role: string;
  lastActive: string;
}

const showAll = ref(false);

const allOnlineUsers: OnlineUser[] = [
  {
    id: 1,
    name: "Emma Smith",
    role: "Admin",
    lastActive: "2024-01-29T10:30:00Z",
  },
  {
    id: 2,
    name: "John Doe",
    role: "Editor",
    lastActive: "2024-01-29T10:25:00Z",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "Viewer",
    lastActive: "2024-01-29T10:20:00Z",
  },
  {
    id: 4,
    name: "Mike Wilson",
    role: "Editor",
    lastActive: "2024-01-29T10:15:00Z",
  },
  {
    id: 5,
    name: "Lisa Brown",
    role: "Admin",
    lastActive: "2024-01-29T10:10:00Z",
  },
  {
    id: 6,
    name: "David Lee",
    role: "Viewer",
    lastActive: "2024-01-29T10:05:00Z",
  },
  {
    id: 7,
    name: "Amy Chen",
    role: "Editor",
    lastActive: "2024-01-29T10:00:00Z",
  },
  {
    id: 8,
    name: "Tom Harris",
    role: "Viewer",
    lastActive: "2024-01-29T09:55:00Z",
  },
];

const totalOnline = allOnlineUsers.length;

const onlineUsers = computed(() => {
  return showAll.value ? allOnlineUsers : allOnlineUsers.slice(0, 5);
});

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

function formatLastActive(timestamp: string): string {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now.getTime() - past.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;

  return past.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
</script>
