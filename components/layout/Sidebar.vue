<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 flex flex-col bg-[var(--color-bg-sidebar)] border-r border-[var(--color-border-primary)] transition-all duration-300 lg:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      collapsed ? 'w-[70px]' : 'w-64',
    ]"
    @touchstart="handleTouchStart"
    @touchmove="handleTouchMove"
    @touchend="handleTouchEnd"
  >
    <!-- Logo -->
    <div
      class="flex items-center gap-3 px-4 h-16 border-b border-[var(--color-border-primary)] flex-shrink-0"
    >
      <img
        :src="
          collapsed
            ? '/nexus-pulse-logo-closed.png'
            : '/nexus-pulse-logo-open.png'
        "
        alt="Nexus Pulse"
        :class="collapsed ? 'main-logo-closed' : 'main-logo'"
      />
      <span
        v-if="!collapsed"
        class="text-lg font-semibold text-[var(--color-text-primary)] tracking-tight transition-opacity duration-200 truncate"
      ></span>
      <!-- Collapse toggle button (desktop only) -->
      <button
        v-if="!isOpen"
        class="ml-auto hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-bg-hover)] transition-colors flex-shrink-0"
        :class="collapsed ? 'collapse-icon-button' : ''"
        @click="$emit('toggleCollapse')"
      >
        <svg
          :class="[
            'w-5 h-5 text-[var(--color-text-secondary)] transition-transform duration-300',
            collapsed ? 'rotate-180' : '',
          ]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M18.75 19.5l-7.5-7.5 7.5-7.5m-6 15L5.25 12l7.5-7.5"
          />
        </svg>
      </button>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
      <div v-for="item in navItems" :key="item.path" class="relative group">
        <NuxtLink
          :to="item.path"
          :class="[
            'sidebar-link',
            isActive(item.path) ? 'active' : '',
            collapsed ? 'justify-center px-2' : '',
          ]"
          @click="closeMobile"
        >
          <component
            :is="
              () =>
                h('div', {
                  class: 'w-5 h-5 flex-shrink-0',
                  innerHTML: item.icon,
                })
            "
          />
          <span
            v-if="!collapsed"
            class="transition-opacity duration-200 truncate"
            >{{ item.label }}</span
          >
          <!-- Notification badge -->
          <span
            v-if="
              item.badge && notificationsStore.unreadCount > 0 && !collapsed
            "
            class="ml-auto px-2 py-0.5 text-xs font-semibold rounded-full bg-[var(--color-danger)] text-white"
          >
            {{
              notificationsStore.unreadCount > 99
                ? "99+"
                : notificationsStore.unreadCount
            }}
          </span>
        </NuxtLink>

        <!-- Tooltip for collapsed state -->
        <div
          v-if="collapsed"
          class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-50"
        >
          <span class="text-sm font-medium text-[var(--color-text-primary)]">{{
            item.label
          }}</span>
        </div>
      </div>
    </nav>

    <!-- Bottom section -->
    <div
      class="px-3 py-4 border-t border-[var(--color-border-primary)] space-y-1 flex-shrink-0"
    >
      <!-- Theme toggle -->
      <div class="relative group">
        <button
          :class="[
            'sidebar-link w-full',
            collapsed ? 'justify-center px-2' : '',
          ]"
          @click="toggleTheme"
        >
          <div
            class="w-5 h-5 flex-shrink-0"
            v-html="isDark ? sunIcon : moonIcon"
          />
          <span
            v-if="!collapsed"
            class="transition-opacity duration-200 truncate"
            >{{ isDark ? "Light Mode" : "Dark Mode" }}</span
          >
        </button>

        <!-- Tooltip for collapsed state -->
        <div
          v-if="collapsed"
          class="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-[var(--color-bg-primary)] border border-[var(--color-border-primary)] rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 pointer-events-none whitespace-nowrap z-50"
        >
          <span class="text-sm font-medium text-[var(--color-text-primary)]">{{
            isDark ? "Light Mode" : "Dark Mode"
          }}</span>
        </div>
      </div>
    </div>
  </aside>

  <!-- Mobile backdrop -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
      @click="$emit('close')"
    />
  </Transition>
</template>

<script setup lang="ts">
import { h, ref } from "vue";
import { useNotificationsStore } from "~/stores/notifications";

interface Props {
  isOpen: boolean;
  collapsed?: boolean;
}

withDefaults(defineProps<Props>(), {
  collapsed: false,
});

const emit = defineEmits<{
  close: [];
  toggleCollapse: [];
}>();

const route = useRoute();
const { isDark, toggleTheme } = useTheme();
const notificationsStore = useNotificationsStore();

// Touch gesture handling
const touchStartX = ref(0);
const touchCurrentX = ref(0);
const isSwiping = ref(false);

function handleTouchStart(event: TouchEvent) {
  touchStartX.value = event.touches[0].clientX;
  isSwiping.value = true;
}

function handleTouchMove(event: TouchEvent) {
  if (!isSwiping.value) return;
  touchCurrentX.value = event.touches[0].clientX;
}

function handleTouchEnd() {
  if (!isSwiping.value) return;

  const swipeDistance = touchStartX.value - touchCurrentX.value;

  // If swiped left more than 100px, close sidebar
  if (swipeDistance > 100) {
    emit("close");
  }

  isSwiping.value = false;
}

function isActive(path: string) {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
}

function closeMobile() {
  if (window.innerWidth < 1024) {
    emit("close");
  }
}

const sunIcon =
  '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>';
const moonIcon =
  '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>';

const navItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>',
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>',
  },
  {
    label: "Users",
    path: "/users",
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>',
  },
  {
    label: "Reports",
    path: "/reports",
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>',
  },
  {
    label: "Audit Log",
    path: "/auditLog",
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>',
  },
  {
    label: "Notifications",
    path: "/notifications",
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>',
    badge: true,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>',
  },
  {
    label: "Settings",
    path: "/settings",
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>',
  },
];
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
