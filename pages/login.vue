<template>
  <div class="w-full max-w-md">
    <!-- Logo & heading -->
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center logo-login">
        <img src="/nexus-pulse-logo-open.png" alt="Nexus Pulse" />
      </div>
      <!-- <img src="/nexus-pulse-logo-open.png" alt="Nexus Pulse" /> -->
      <h1
        class="text-2xl font-semibold text-[var(--color-text-primary)] tracking-tight"
      >
        Welcome back
      </h1>
      <p class="text-sm text-[var(--color-text-secondary)] mt-2">
        Sign in to your Nexus Pulse account
      </p>
    </div>

    <!-- Login card -->
    <div class="card p-8">
      <form @submit.prevent="handleSubmit" class="space-y-5">
        <!-- Email -->
        <UiInput
          v-model="email"
          label="Email address"
          type="email"
          placeholder="you@example.com"
          :error="emailError"
          @blur="validateEmail"
        >
          <template #icon>
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
                d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"
              />
            </svg>
          </template>
        </UiInput>

        <!-- Password -->
        <UiInput
          v-model="password"
          label="Password"
          type="password"
          placeholder="Enter your password"
          :error="passwordError"
          @blur="validatePassword"
        >
          <template #icon>
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
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </template>
        </UiInput>

        <!-- Error message -->
        <Transition name="fade">
          <div
            v-if="authError"
            class="flex items-center gap-2 p-3 rounded-xl bg-[var(--color-danger-light)] border border-[var(--color-danger)] border-opacity-20"
          >
            <svg
              class="w-4 h-4 text-[var(--color-danger)] flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
              />
            </svg>
            <p class="text-sm text-[var(--color-danger)]">{{ authError }}</p>
          </div>
        </Transition>

        <!-- Submit -->
        <UiButton
          type="submit"
          variant="primary"
          size="lg"
          :loading="isLoading"
          :disabled="!isFormValid"
          class="w-full"
        >
          Sign in
        </UiButton>
      </form>

      <!-- Demo hint -->
      <div
        class="mt-6 p-4 rounded-xl bg-[var(--color-bg-tertiary)] border border-[var(--color-border-secondary)]"
      >
        <div class="flex items-start gap-2.5">
          <svg
            class="w-4 h-4 text-[var(--color-accent)] mt-0.5 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.845a21.75 21.75 0 01-6.442-.008M12 12.75h.008v.008H12v-.008z"
            />
          </svg>
          <div>
            <p class="text-xs font-medium text-[var(--color-text-primary)]">
              Demo credentials
            </p>
            <p class="text-xs text-[var(--color-text-tertiary)] mt-0.5">
              Use any email with password
              <code
                class="px-1.5 py-0.5 rounded bg-[var(--color-bg-active)] text-[var(--color-text-secondary)] font-mono text-[11px]"
                >password123</code
              >
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

definePageMeta({
  layout: "auth",
  middleware: [],
});

const { login, isLoading, error: authError } = useAuth();

const email = ref("");
const password = ref("");
const emailError = ref("");
const passwordError = ref("");
const touched = ref({ email: false, password: false });

function validateEmail() {
  touched.value.email = true;
  if (!email.value) {
    emailError.value = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
    emailError.value = "Please enter a valid email";
  } else {
    emailError.value = "";
  }
}

function validatePassword() {
  touched.value.password = true;
  if (!password.value) {
    passwordError.value = "Password is required";
  } else {
    passwordError.value = "";
  }
}

const isFormValid = computed(() => {
  return (
    email.value && password.value && !emailError.value && !passwordError.value
  );
});

async function handleSubmit() {
  validateEmail();
  validatePassword();

  if (emailError.value || passwordError.value) return;

  const success = await login(email.value, password.value);
  if (success) {
    navigateTo("/");
  }
}
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
