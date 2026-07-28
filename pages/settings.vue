<template>
  <div class="space-y-8 animate-fade-in max-w-3xl">
    <!-- Page header -->
    <div>
      <h1 class="page-title">Settings</h1>
      <p class="page-subtitle">Manage your account preferences and configuration.</p>
    </div>

    <!-- Appearance -->
    <section class="card p-6 space-y-6">
      <div>
        <h2 class="text-base font-semibold text-[var(--color-text-primary)]">Appearance</h2>
        <p class="text-sm text-[var(--color-text-tertiary)] mt-0.5">Customize how the app looks.</p>
      </div>

      <div class="flex items-center justify-between">
        <div>
          <p class="text-sm font-medium text-[var(--color-text-primary)]">Dark mode</p>
          <p class="text-xs text-[var(--color-text-tertiary)] mt-0.5">Toggle between light and dark theme</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="flex items-center gap-2">
            <svg class="w-4 h-4 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
            </svg>
            <UiToggle :model-value="isDark" @update:model-value="toggleTheme" />
            <svg class="w-4 h-4 text-[var(--color-text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Profile -->
    <section class="card p-6 space-y-6">
      <div>
        <h2 class="text-base font-semibold text-[var(--color-text-primary)]">Profile</h2>
        <p class="text-sm text-[var(--color-text-tertiary)] mt-0.5">Update your personal information.</p>
      </div>

      <div class="flex items-center gap-4">
        <div class="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-accent)] to-purple-500 flex items-center justify-center text-white text-xl font-semibold">
          {{ profileInitials }}
        </div>
        <div>
          <p class="text-sm font-medium text-[var(--color-text-primary)]">{{ settingsStore.profileName || 'Your Name' }}</p>
          <p class="text-xs text-[var(--color-text-tertiary)]">{{ settingsStore.profileEmail || userEmail || 'user@example.com' }}</p>
        </div>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <UiInput
          v-model="settingsStore.profileName"
          label="Full name"
          placeholder="John Doe"
        />
        <UiInput
          v-model="settingsStore.profileEmail"
          label="Email address"
          type="email"
          placeholder="john@example.com"
        />
      </div>
    </section>

    <!-- Notifications -->
    <section class="card p-6 space-y-6">
      <div>
        <h2 class="text-base font-semibold text-[var(--color-text-primary)]">Notifications</h2>
        <p class="text-sm text-[var(--color-text-tertiary)] mt-0.5">Choose what notifications you receive.</p>
      </div>

      <div class="space-y-4">
        <div class="flex items-center justify-between py-1">
          <div>
            <p class="text-sm font-medium text-[var(--color-text-primary)]">Email notifications</p>
            <p class="text-xs text-[var(--color-text-tertiary)] mt-0.5">Receive updates via email</p>
          </div>
          <UiToggle
            :model-value="settingsStore.notifications.email"
            @update:model-value="settingsStore.notifications.email = $event"
          />
        </div>

        <div class="border-t border-[var(--color-border-secondary)]" />

        <div class="flex items-center justify-between py-1">
          <div>
            <p class="text-sm font-medium text-[var(--color-text-primary)]">Push notifications</p>
            <p class="text-xs text-[var(--color-text-tertiary)] mt-0.5">Receive push notifications in your browser</p>
          </div>
          <UiToggle
            :model-value="settingsStore.notifications.push"
            @update:model-value="settingsStore.notifications.push = $event"
          />
        </div>

        <div class="border-t border-[var(--color-border-secondary)]" />

        <div class="flex items-center justify-between py-1">
          <div>
            <p class="text-sm font-medium text-[var(--color-text-primary)]">Marketing emails</p>
            <p class="text-xs text-[var(--color-text-tertiary)] mt-0.5">Receive tips, product updates and inspiration</p>
          </div>
          <UiToggle
            :model-value="settingsStore.notifications.marketing"
            @update:model-value="settingsStore.notifications.marketing = $event"
          />
        </div>
      </div>
    </section>

    <!-- Language & Region -->
    <section class="card p-6 space-y-6">
      <div>
        <h2 class="text-base font-semibold text-[var(--color-text-primary)]">Language & Region</h2>
        <p class="text-sm text-[var(--color-text-tertiary)] mt-0.5">Set your preferred language.</p>
      </div>

      <div class="relative max-w-xs">
        <select
          v-model="settingsStore.language"
          class="input-base pl-9 pr-8 appearance-none cursor-pointer"
        >
          <option value="English">English</option>
          <option value="Albanian">Albanian</option>
          <option value="Italian">Italian</option>
        </select>
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-tertiary)]">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.891.061 1.767.147 2.627.258m-2.627-.258l6.573 6.573" />
          </svg>
        </div>
        <div class="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none text-[var(--color-text-tertiary)]">
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </div>
      </div>
    </section>

    <!-- Save button -->
    <div class="flex justify-end">
      <UiButton variant="primary" size="lg" @click="settingsStore.saveSettings()">
        Save Changes
      </UiButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useSettingsStore } from '~/stores/settings';

definePageMeta({
  middleware: 'auth',
});

const settingsStore = useSettingsStore();
const { isDark, toggleTheme } = useTheme();
const { userEmail } = useAuth();

const profileInitials = computed(() => {
  const name = settingsStore.profileName || 'User';
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
});

onMounted(() => {
  settingsStore.loadSettings();
  if (!settingsStore.profileEmail && userEmail.value) {
    settingsStore.profileEmail = userEmail.value;
  }
});
</script>
