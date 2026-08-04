<template>
  <header
    class="sticky top-0 z-20 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-[var(--color-bg-primary)] backdrop-blur-md border-b border-[var(--color-border-primary)]"
  >
    <!-- Left: Hamburger + Page title -->
    <div class="flex items-center gap-4">
      <button
        class="lg:hidden p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
        @click="$emit('toggleSidebar')"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </button>
      <div>
        <h1 class="page-title text-lg">{{ pageTitle }}</h1>
      </div>
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-2">
      <!-- Search (decorative) -->
      <button
        class="hidden sm:flex p-2 rounded-xl text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
      >
        <svg
          class="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
      </button>

      <!-- Notification bell -->
      <div class="relative" ref="notificationDropdownRef">
        <button
          class="relative p-2 rounded-xl text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
          @click="notificationDropdownOpen = !notificationDropdownOpen"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
            />
          </svg>
          <span
            v-if="notificationsStore.unreadCount > 0"
            class="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[var(--color-danger)] text-white text-[10px] font-semibold flex items-center justify-center"
          >
            {{
              notificationsStore.unreadCount > 99
                ? "99+"
                : notificationsStore.unreadCount
            }}
          </span>
        </button>

        <!-- Notification dropdown -->
        <Transition name="dropdown">
          <div
            v-if="notificationDropdownOpen"
            class="absolute right-0 mt-2 w-[calc(100vw-2rem)] sm:w-96 bg-[var(--color-bg-card)] border border-[var(--color-border-primary)] rounded-xl shadow-elevated animate-slide-down"
          >
            <!-- Header -->
            <div
              class="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border-primary)]"
            >
              <h3
                class="text-sm font-semibold text-[var(--color-text-primary)]"
              >
                Notifications
              </h3>
              <button
                v-if="notificationsStore.unreadCount > 0"
                class="text-xs text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] font-medium"
                @click="notificationsStore.markAllAsRead()"
              >
                Mark all as read
              </button>
            </div>

            <!-- Notifications list -->
            <div class="max-h-96 overflow-y-auto">
              <div
                v-if="recentNotifications.length === 0"
                class="p-8 text-center"
              >
                <svg
                  class="w-12 h-12 mx-auto text-[var(--color-text-tertiary)] mb-2"
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
                <p class="text-sm text-[var(--color-text-secondary)]">
                  No notifications
                </p>
              </div>

              <div
                v-else
                class="divide-y divide-[var(--color-border-secondary)]"
              >
                <div
                  v-for="notification in recentNotifications"
                  :key="notification.id"
                  :class="[
                    'flex items-start gap-3 px-4 py-3 hover:bg-[var(--color-bg-hover)] transition-colors cursor-pointer',
                    !notification.read && 'bg-[var(--color-accent-light)]',
                  ]"
                  @click="handleNotificationClick(notification)"
                >
                  <!-- Icon -->
                  <div
                    :class="[
                      'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
                      getIconClass(notification.type),
                    ]"
                  >
                    <div v-html="getIcon(notification.type)" class="w-4 h-4" />
                  </div>

                  <!-- Content -->
                  <div class="flex-1 min-w-0">
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
                    <p class="text-xs text-[var(--color-text-tertiary)] mt-0.5">
                      {{ formatTimeAgo(notification.timestamp) }}
                    </p>
                  </div>

                  <!-- Unread indicator -->
                  <div
                    v-if="!notification.read"
                    class="flex-shrink-0 w-2 h-2 rounded-full bg-[var(--color-accent)] mt-2"
                  />
                </div>
              </div>
            </div>

            <!-- Footer -->
            <div
              class="px-4 py-3 border-t border-[var(--color-border-primary)]"
            >
              <NuxtLink
                to="/notifications"
                class="block text-center text-sm font-medium text-[var(--color-accent)] hover:text-[var(--color-accent-hover)] transition-colors"
                @click="notificationDropdownOpen = false"
              >
                View all notifications
              </NuxtLink>
            </div>
          </div>
        </Transition>
      </div>

      <!-- User dropdown -->
      <div class="relative" ref="dropdownRef">
        <button
          class="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-[var(--color-bg-hover)] transition-colors"
          @click="dropdownOpen = !dropdownOpen"
        >
          <div
            class="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-purple-500 flex items-center justify-center text-white text-xs font-semibold"
          >
            {{ userInitials }}
          </div>
          <span
            class="hidden sm:block text-sm font-medium text-[var(--color-text-primary)]"
          >
            {{ displayName }}
          </span>
          <svg
            class="w-4 h-4 text-[var(--color-text-tertiary)] hidden sm:block"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M19.5 8.25l-7.5 7.5-7.5-7.5"
            />
          </svg>
        </button>

        <!-- Dropdown menu -->
        <Transition name="dropdown">
          <div
            v-if="dropdownOpen"
            class="absolute right-0 mt-2 w-56 bg-[var(--color-bg-card)] border border-[var(--color-border-primary)] rounded-xl shadow-elevated py-1.5 animate-slide-down"
          >
            <div
              class="px-4 py-2 border-b border-[var(--color-border-primary)]"
            >
              <p class="text-sm font-medium text-[var(--color-text-primary)]">
                {{ displayName }}
              </p>
              <p class="text-xs text-[var(--color-text-tertiary)]">
                {{ userEmail || "user@example.com" }}
              </p>
            </div>
            <NuxtLink
              to="/settings"
              class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors"
              @click="dropdownOpen = false"
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
                  d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Settings
            </NuxtLink>
            <button
              class="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-colors"
              @click="handleLogout"
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
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
              Sign out
            </button>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useNotificationsStore } from "~/stores/notifications";
import type { NotificationType } from "~/stores/notifications";

defineEmits<{ toggleSidebar: [] }>();

const route = useRoute();
const { userName, userEmail, logout } = useAuth();
const notificationsStore = useNotificationsStore();

const dropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);
const notificationDropdownOpen = ref(false);
const notificationDropdownRef = ref<HTMLElement | null>(null);

const recentNotifications = computed(() => {
  return notificationsStore.notifications.slice(0, 5);
});

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    dropdownOpen.value = false;
  }
  if (
    notificationDropdownRef.value &&
    !notificationDropdownRef.value.contains(event.target as Node)
  ) {
    notificationDropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    "/": "Dashboard",
    "/analytics": "Analytics",
    "/users": "Users",
    "/reports": "Reports",
    "/auditLog": "Audit Log",
    "/notifications": "Notifications",
    "/profile": "Profile",
    "/settings": "Settings",
  };
  return titles[route.path] || "Dashboard";
});

const displayName = computed(() => userName.value || "User");
const userInitials = computed(() => {
  const name = displayName.value;
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
});

function handleLogout() {
  dropdownOpen.value = false;
  logout();
}

function handleNotificationClick(notification: any) {
  if (!notification.read) {
    notificationsStore.markAsRead(notification.id);
  }
  notificationDropdownOpen.value = false;
}

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
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;

  return past.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
</script>

<style scoped>
.dropdown-enter-active {
  transition: all 150ms ease-out;
}
.dropdown-leave-active {
  transition: all 100ms ease-in;
}
.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
