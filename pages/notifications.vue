<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="page-title">Notifications</h1>
        <p class="page-subtitle">Stay updated with the latest activity</p>
      </div>
      <UiButton
        v-if="notificationsStore.unreadCount > 0"
        variant="secondary"
        @click="notificationsStore.markAllAsRead()"
      >
        Mark all as read
      </UiButton>
    </div>

    <!-- Filters -->
    <div class="card p-4">
      <div
        class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <!-- Filter tabs -->
        <div
          class="flex items-center gap-1 p-1 rounded-xl bg-[var(--color-bg-tertiary)]"
        >
          <button
            v-for="tab in tabs"
            :key="tab.value"
            :class="[
              'px-3.5 py-1.5 text-sm font-medium rounded-lg transition-all',
              notificationsStore.filter === tab.value
                ? 'bg-[var(--color-bg-card)] text-[var(--color-text-primary)] shadow-soft'
                : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]',
            ]"
            @click="notificationsStore.setFilter(tab.value)"
          >
            {{ tab.label }}
            <span
              v-if="notificationsStore.counts[tab.value] > 0"
              class="ml-1.5 px-1.5 py-0.5 text-xs rounded-full bg-[var(--color-bg-tertiary)]"
            >
              {{ notificationsStore.counts[tab.value] }}
            </span>
          </button>
        </div>

        <!-- Unread toggle -->
        <label class="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            :checked="notificationsStore.showUnreadOnly"
            class="w-4 h-4 rounded border-[var(--color-border-primary)] text-[var(--color-accent)] focus:ring-[var(--color-accent)]"
            @change="notificationsStore.toggleUnreadOnly()"
          />
          <span class="text-sm text-[var(--color-text-secondary)]"
            >Unread only</span
          >
        </label>
      </div>
    </div>

    <!-- Notifications list -->
    <div class="card overflow-hidden">
      <div
        v-if="notificationsStore.filteredNotifications.length === 0"
        class="p-12 text-center"
      >
        <svg
          class="w-12 h-12 mx-auto text-[var(--color-text-tertiary)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="1"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        <p class="mt-3 text-sm text-[var(--color-text-secondary)]">
          No notifications
        </p>
        <p class="text-xs text-[var(--color-text-tertiary)]">
          You're all caught up!
        </p>
      </div>

      <div v-else class="divide-y divide-[var(--color-border-secondary)]">
        <div
          v-for="notification in notificationsStore.filteredNotifications"
          :key="notification.id"
          :class="[
            'flex items-start gap-4 p-6 transition-colors',
            notification.read
              ? 'bg-[var(--color-bg-primary)]'
              : 'bg-[var(--color-accent-light)]',
            'hover:bg-[var(--color-bg-hover)]',
          ]"
        >
          <!-- Icon -->
          <div
            :class="[
              'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center',
              getIconClass(notification.type),
            ]"
          >
            <div v-html="getIcon(notification.type)" class="w-5 h-5" />
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between gap-4">
              <div class="flex-1">
                <p
                  :class="[
                    'text-sm',
                    notification.read
                      ? 'text-[var(--color-text-secondary)]'
                      : 'text-[var(--color-text-primary)] font-semibold',
                  ]"
                >
                  {{ notification.title }}
                </p>
                <p class="text-sm text-[var(--color-text-tertiary)] mt-1">
                  {{ notification.description }}
                </p>
              </div>

              <!-- Actions -->
              <div class="flex items-center gap-1 flex-shrink-0">
                <button
                  v-if="!notification.read"
                  class="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-accent)] hover:bg-[var(--color-accent-light)] transition-colors"
                  title="Mark as read"
                  @click="notificationsStore.markAsRead(notification.id)"
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </button>
                <button
                  v-else
                  class="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
                  title="Mark as unread"
                  @click="notificationsStore.markAsUnread(notification.id)"
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
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </button>
                <button
                  class="p-1.5 rounded-lg text-[var(--color-text-tertiary)] hover:text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-colors"
                  title="Delete"
                  @click="
                    notificationsStore.deleteNotification(notification.id)
                  "
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
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Timestamp -->
            <p class="text-xs text-[var(--color-text-tertiary)] mt-2">
              {{ formatTimeAgo(notification.timestamp) }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useNotificationsStore } from "~/stores/notifications";
import type { NotificationType } from "~/stores/notifications";

definePageMeta({
  middleware: "auth",
});

const notificationsStore = useNotificationsStore();

const tabs = [
  { label: "All", value: "all" as const },
  { label: "Mentions", value: "mention" as const },
  { label: "Updates", value: "update" as const },
  { label: "Alerts", value: "alert" as const },
  { label: "System", value: "system" as const },
];

function getIcon(type: NotificationType): string {
  const icons: Record<NotificationType, string> = {
    mention:
      '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>',
    update:
      '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>',
    alert:
      '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>',
    system:
      '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
  };
  return icons[type];
}

function getIconClass(type: NotificationType): string {
  const classes: Record<NotificationType, string> = {
    mention: "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    update:
      "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    alert:
      "bg-orange-100 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
    system:
      "bg-purple-100 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400",
  };
  return classes[type];
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
