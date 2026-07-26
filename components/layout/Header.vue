<template>
  <header class="sticky top-0 z-20 flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8 bg-[var(--color-bg-primary)] backdrop-blur-md border-b border-[var(--color-border-primary)]">
    <!-- Left: Hamburger + Page title -->
    <div class="flex items-center gap-4">
      <button
        class="lg:hidden p-2 rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors"
        @click="$emit('toggleSidebar')"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <div>
        <h1 class="page-title text-lg">{{ pageTitle }}</h1>
      </div>
    </div>

    <!-- Right: Actions -->
    <div class="flex items-center gap-2">
      <!-- Search (decorative) -->
      <button class="hidden sm:flex p-2 rounded-xl text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </button>

      <!-- Notification bell -->
      <button class="relative p-2 rounded-xl text-[var(--color-text-tertiary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)] transition-colors">
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        <span class="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[var(--color-accent)]" />
      </button>

      <!-- User dropdown -->
      <div class="relative" ref="dropdownRef">
        <button
          class="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl hover:bg-[var(--color-bg-hover)] transition-colors"
          @click="dropdownOpen = !dropdownOpen"
        >
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-accent)] to-purple-500 flex items-center justify-center text-white text-xs font-semibold">
            {{ userInitials }}
          </div>
          <span class="hidden sm:block text-sm font-medium text-[var(--color-text-primary)]">
            {{ displayName }}
          </span>
          <svg class="w-4 h-4 text-[var(--color-text-tertiary)] hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>

        <!-- Dropdown menu -->
        <Transition name="dropdown">
          <div
            v-if="dropdownOpen"
            class="absolute right-0 mt-2 w-56 bg-[var(--color-bg-card)] border border-[var(--color-border-primary)] rounded-xl shadow-elevated py-1.5 animate-slide-down"
          >
            <div class="px-4 py-2 border-b border-[var(--color-border-primary)]">
              <p class="text-sm font-medium text-[var(--color-text-primary)]">{{ displayName }}</p>
              <p class="text-xs text-[var(--color-text-tertiary)]">{{ userEmail || 'user@example.com' }}</p>
            </div>
            <NuxtLink
              to="/settings"
              class="flex items-center gap-2.5 px-4 py-2.5 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)] hover:text-[var(--color-text-primary)] transition-colors"
              @click="dropdownOpen = false"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Settings
            </NuxtLink>
            <button
              class="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-[var(--color-danger)] hover:bg-[var(--color-danger-light)] transition-colors"
              @click="handleLogout"
            >
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
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
import { ref, onMounted, onBeforeUnmount } from 'vue';

defineEmits<{ toggleSidebar: [] }>();

const route = useRoute();
const { userName, userEmail, logout } = useAuth();

const dropdownOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

function handleClickOutside(event: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    dropdownOpen.value = false;
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/analytics': 'Analytics',
    '/users': 'Users',
    '/settings': 'Settings',
  };
  return titles[route.path] || 'Dashboard';
});

const displayName = computed(() => userName.value || 'User');
const userInitials = computed(() => {
  const name = displayName.value;
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
});

function handleLogout() {
  dropdownOpen.value = false;
  logout();
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
