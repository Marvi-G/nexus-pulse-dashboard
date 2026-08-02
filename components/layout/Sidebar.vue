<template>
  <aside
    :class="[
      'fixed inset-y-0 left-0 z-40 flex flex-col bg-[var(--color-bg-sidebar)] border-r border-[var(--color-border-primary)] transition-all duration-300 lg:translate-x-0',
      isOpen ? 'translate-x-0' : '-translate-x-full',
      collapsed ? 'w-[70px]' : 'w-64',
    ]"
  >
    <!-- Logo -->
    <div
      class="flex items-center gap-3 px-4 h-16 border-b border-[var(--color-border-primary)] flex-shrink-0"
    >
      <div
        class="flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-accent)] flex-shrink-0"
      >
        <svg
          class="w-4.5 h-4.5 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          stroke-width="2.5"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>
      </div>
      <span
        v-if="!collapsed"
        class="text-lg font-semibold text-[var(--color-text-primary)] tracking-tight transition-opacity duration-200 truncate"
        >Pulse</span
      >

      <!-- Collapse toggle button (desktop only) -->
      <button
        v-if="!isOpen"
        class="ml-auto hidden lg:flex items-center justify-center w-8 h-8 rounded-lg bg-[var(--color-bg-hover)] transition-colors flex-shrink-0"
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
import { h } from "vue";
import { useNotificationsStore } from "~/stores/notifications";

interface Props {
  isOpen: boolean;
  collapsed?: boolean;
}

withDefaults(defineProps<Props>(), {
  collapsed: false,
});

defineEmits<{
  close: [];
  toggleCollapse: [];
}>();

const route = useRoute();
const { isDark, toggleTheme } = useTheme();
const notificationsStore = useNotificationsStore();

function isActive(path: string) {
  if (path === "/") return route.path === "/";
  return route.path.startsWith(path);
}

function closeMobile() {
  // emit handled by parent
}

const sunIcon =
  '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>';
const moonIcon =
  '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/></svg>';

const navItems = [
  {
    label: "Dashboard",
    path: "/",
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"/></svg>',
  },
  {
    label: "Analytics",
    path: "/analytics",
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75c0 .621-.504 1.125-1.125 1.125h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>',
  },
  {
    label: "Users",
    path: "/users",
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"/></svg>',
  },
  {
    label: "Notifications",
    path: "/notifications",
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"/></svg>',
    badge: true,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: '<svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.75"><path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z"/><path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/></svg>',
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
