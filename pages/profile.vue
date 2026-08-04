<template>
  <div class="space-y-6 animate-fade-in">
    <!-- Page header -->
    <div>
      <h1 class="page-title">Profile</h1>
      <p class="page-subtitle">Manage your account settings and preferences</p>
    </div>

    <!-- Profile Information -->
    <div class="card">
      <div class="p-6 border-b border-[var(--color-border-primary)]">
        <h2 class="text-lg font-semibold text-[var(--color-text-primary)]">
          Profile Information
        </h2>
        <p class="text-sm text-[var(--color-text-tertiary)] mt-1">
          Update your personal details and public profile
        </p>
      </div>

      <div class="p-6 space-y-6">
        <!-- Avatar -->
        <div class="flex items-center gap-6">
          <div class="relative">
            <img
              :src="profileStore.profile.avatar"
              :alt="profileStore.profile.name"
              class="w-24 h-24 rounded-full object-cover border-4 border-[var(--color-bg-card)] shadow-lg"
            />
            <button
              class="absolute bottom-0 right-0 w-8 h-8 bg-[var(--color-accent)] rounded-full flex items-center justify-center text-white hover:bg-[var(--color-accent-hover)] transition-colors shadow-lg"
              @click="handleAvatarChange"
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
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
          </div>
          <div>
            <h3 class="text-lg font-semibold text-[var(--color-text-primary)]">
              {{ profileStore.profile.name }}
            </h3>
            <p class="text-sm text-[var(--color-text-tertiary)]">
              {{ profileStore.profile.role }}
            </p>
          </div>
        </div>

        <!-- Form fields -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UiInput
            v-model="profileStore.profile.name"
            label="Full Name"
            placeholder="John Doe"
          />
          <UiInput
            v-model="profileStore.profile.email"
            label="Email Address"
            type="email"
            placeholder="john@example.com"
          />
          <UiInput
            v-model="profileStore.profile.phone"
            label="Phone Number"
            type="tel"
            placeholder="+1 (555) 123-4567"
          />
          <UiInput
            v-model="profileStore.profile.location"
            label="Location"
            placeholder="San Francisco, CA"
          />
        </div>

        <div>
          <label
            class="block text-sm font-medium text-[var(--color-text-primary)] mb-2"
            >Bio</label
          >
          <textarea
            v-model="profileStore.profile.bio"
            rows="3"
            class="input-base resize-none"
            placeholder="Tell us about yourself..."
          />
        </div>

        <div class="flex justify-end">
          <UiButton variant="primary" @click="saveProfile">
            Save Changes
          </UiButton>
        </div>
      </div>
    </div>

    <!-- Notification Preferences -->
    <div class="card">
      <div class="p-6 border-b border-[var(--color-border-primary)]">
        <h2 class="text-lg font-semibold text-[var(--color-text-primary)]">
          Notification Preferences
        </h2>
        <p class="text-sm text-[var(--color-text-tertiary)] mt-1">
          Choose how you want to be notified
        </p>
      </div>

      <div class="p-6 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-[var(--color-text-primary)]">
              Email Notifications
            </h3>
            <p class="text-sm text-[var(--color-text-tertiary)]">
              Receive notifications via email
            </p>
          </div>
          <UiToggle
            :model-value="profileStore.notifications.emailNotifications"
            @update:model-value="
              profileStore.notifications.emailNotifications = $event
            "
          />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-[var(--color-text-primary)]">
              Push Notifications
            </h3>
            <p class="text-sm text-[var(--color-text-tertiary)]">
              Receive push notifications in your browser
            </p>
          </div>
          <UiToggle
            :model-value="profileStore.notifications.pushNotifications"
            @update:model-value="
              profileStore.notifications.pushNotifications = $event
            "
          />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-[var(--color-text-primary)]">
              Weekly Digest
            </h3>
            <p class="text-sm text-[var(--color-text-tertiary)]">
              Receive a weekly summary of activity
            </p>
          </div>
          <UiToggle
            :model-value="profileStore.notifications.weeklyDigest"
            @update:model-value="
              profileStore.notifications.weeklyDigest = $event
            "
          />
        </div>

        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-medium text-[var(--color-text-primary)]">
              Security Alerts
            </h3>
            <p class="text-sm text-[var(--color-text-tertiary)]">
              Get notified about security-related events
            </p>
          </div>
          <UiToggle
            :model-value="profileStore.notifications.securityAlerts"
            @update:model-value="
              profileStore.notifications.securityAlerts = $event
            "
          />
        </div>

        <div class="flex justify-end pt-4">
          <UiButton variant="primary" @click="saveNotifications">
            Save Preferences
          </UiButton>
        </div>
      </div>
    </div>

    <!-- Security Settings -->
    <div class="card">
      <div class="p-6 border-b border-[var(--color-border-primary)]">
        <h2 class="text-lg font-semibold text-[var(--color-text-primary)]">
          Security
        </h2>
        <p class="text-sm text-[var(--color-text-tertiary)] mt-1">
          Manage your account security
        </p>
      </div>

      <div class="p-6 space-y-6">
        <!-- Two-Factor Authentication -->
        <div
          class="flex items-center justify-between p-4 bg-[var(--color-bg-secondary)] rounded-xl"
        >
          <div class="flex items-center gap-4">
            <div
              class="w-12 h-12 bg-[var(--color-accent-light)] rounded-lg flex items-center justify-center"
            >
              <svg
                class="w-6 h-6 text-[var(--color-accent)]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <div>
              <h3 class="text-sm font-medium text-[var(--color-text-primary)]">
                Two-Factor Authentication
              </h3>
              <p class="text-sm text-[var(--color-text-tertiary)]">
                {{
                  profileStore.security.twoFactorEnabled
                    ? "Enabled"
                    : "Disabled"
                }}
              </p>
            </div>
          </div>
          <UiButton
            :variant="
              profileStore.security.twoFactorEnabled ? 'secondary' : 'primary'
            "
            @click="toggleTwoFactor"
          >
            {{ profileStore.security.twoFactorEnabled ? "Disable" : "Enable" }}
          </UiButton>
        </div>

        <!-- Password -->
        <div class="p-4 bg-[var(--color-bg-secondary)] rounded-xl">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-4">
              <div
                class="w-12 h-12 bg-[var(--color-accent-light)] rounded-lg flex items-center justify-center"
              >
                <svg
                  class="w-6 h-6 text-[var(--color-accent)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <div>
                <h3
                  class="text-sm font-medium text-[var(--color-text-primary)]"
                >
                  Password
                </h3>
                <p class="text-sm text-[var(--color-text-tertiary)]">
                  Last changed:
                  {{ formatDate(profileStore.security.lastPasswordChange) }}
                </p>
              </div>
            </div>
            <UiButton variant="secondary" @click="handleChangePassword">
              Change Password
            </UiButton>
          </div>
        </div>

        <!-- Active Sessions -->
        <div>
          <h3 class="text-sm font-medium text-[var(--color-text-primary)] mb-4">
            Active Sessions
          </h3>
          <div class="space-y-3">
            <div
              v-for="session in profileStore.security.sessions"
              :key="session.id"
              class="flex items-center justify-between p-4 bg-[var(--color-bg-secondary)] rounded-xl"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-10 h-10 bg-[var(--color-accent-light)] rounded-lg flex items-center justify-center"
                >
                  <svg
                    class="w-5 h-5 text-[var(--color-accent)]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <div class="flex items-center gap-2">
                    <h4
                      class="text-sm font-medium text-[var(--color-text-primary)]"
                    >
                      {{ session.device }}
                    </h4>
                    <span
                      v-if="session.current"
                      class="px-2 py-0.5 text-xs font-medium bg-[var(--color-success-light)] text-[var(--color-success)] rounded-full"
                    >
                      Current
                    </span>
                  </div>
                  <p class="text-xs text-[var(--color-text-tertiary)]">
                    {{ session.location }} • Last active
                    {{ formatTimestamp(session.lastActive) }}
                  </p>
                </div>
              </div>
              <UiButton
                v-if="!session.current"
                variant="ghost"
                size="sm"
                @click="revokeSession(session.id)"
              >
                Revoke
              </UiButton>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Danger Zone -->
    <div class="card border-[var(--color-danger)] border-opacity-30">
      <div class="p-6 border-b border-[var(--color-border-primary)]">
        <h2 class="text-lg font-semibold text-[var(--color-danger)]">
          Danger Zone
        </h2>
        <p class="text-sm text-[var(--color-text-tertiary)] mt-1">
          Irreversible and destructive actions
        </p>
      </div>

      <div class="p-6">
        <div
          class="flex items-center justify-between p-4 bg-[var(--color-danger-light)] rounded-xl"
        >
          <div>
            <h3 class="text-sm font-medium text-[var(--color-text-primary)]">
              Delete Account
            </h3>
            <p class="text-sm text-[var(--color-text-tertiary)]">
              Permanently delete your account and all associated data
            </p>
          </div>
          <UiButton variant="danger" @click="handleDeleteAccount">
            Delete Account
          </UiButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useProfileStore } from "~/stores/profile";
import { useSettingsStore } from "~/stores/settings";

definePageMeta({
  middleware: "auth",
});

const profileStore = useProfileStore();
const settingsStore = useSettingsStore();

function handleAvatarChange() {
  settingsStore.addToast("Avatar upload feature coming soon", "info");
}

function saveProfile() {
  profileStore.updateProfile(profileStore.profile);
  settingsStore.addToast("Profile updated successfully", "success");
}

function saveNotifications() {
  profileStore.updateNotifications(profileStore.notifications);
  settingsStore.addToast("Notification preferences saved", "success");
}

function toggleTwoFactor() {
  profileStore.toggleTwoFactor();
  const status = profileStore.security.twoFactorEnabled
    ? "enabled"
    : "disabled";
  settingsStore.addToast(`Two-factor authentication ${status}`, "success");
}

function handleChangePassword() {
  settingsStore.addToast("Password change feature coming soon", "info");
}

function revokeSession(sessionId: number) {
  profileStore.revokeSession(sessionId);
  settingsStore.addToast("Session revoked successfully", "success");
}

function handleDeleteAccount() {
  settingsStore.addToast("Account deletion feature coming soon", "info");
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTimestamp(timestamp: string): string {
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
