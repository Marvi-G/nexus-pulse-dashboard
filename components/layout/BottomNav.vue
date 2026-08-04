<template>
  <nav
    class="fixed bottom-0 left-0 right-0 z-30 bg-[var(--color-bg-card)] border-t border-[var(--color-border-primary)] lg:hidden safe-bottom"
  >
    <div class="flex items-center justify-around h-16">
      <NuxtLink
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        :class="[
          'flex flex-col items-center justify-center gap-1 flex-1 h-full transition-colors relative',
          isActive(item.path)
            ? 'text-[var(--color-accent)]'
            : 'text-[var(--color-text-tertiary)] hover:text-[var(--color-text-secondary)]',
        ]"
      >
        <div class="relative">
          <div v-html="item.icon" class="w-5 h-5" />
          <!-- Notification badge -->
          <span
            v-if="item.badge && notificationsStore.unreadCount > 0"
            class="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-[var(--color-danger)] text-white text-[10px] font-semibold flex items-center justify-center"
          >
            {{
              notificationsStore.unreadCount > 99
                ? "99+"
                : notificationsStore.unreadCount
            }}
          </span>
        </div>
        <span class="text-[10px] font-medium">{{ item.label }}</span>
      </NuxtLink>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { useNotificationsStore } from "~/stores/notifications";

const route = useRoute();
const notificationsStore = useNotificationsStore();

function isActive(path: string) {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
}

const navItems = [
  {
    label: "Home",
    path: "/",
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>',
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>',
  },
  {
    label: "Users",
    path: "/users",
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>',
  },
  {
    label: "Reports",
    path: "/reports",
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>',
  },
  {
    label: "More",
    path: "/profile",
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>',
    badge: true,
  },
];
</script>

<style scoped>
.safe-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0);
}
</style>
