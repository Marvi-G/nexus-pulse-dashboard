import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useSettingsStore } from './settings';

export const useAuthStore = defineStore('auth', () => {
  const token = useCookie<string | null>('auth_token', {
    maxAge: 60 * 60 * 24, // 1 day
    sameSite: 'lax',
    secure: import.meta.env.PROD,
  });

  const userName = useCookie<string | null>('user_name', {
    maxAge: 60 * 60 * 24,
  });

  const userEmail = useCookie<string | null>('user_email', {
    maxAge: 60 * 60 * 24,
  });

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const isAuthenticated = computed(() => !!token.value);

  async function login(email: string, password: string): Promise<boolean> {
    isLoading.value = true;
    error.value = null;

    try {
      // Mock API call with 1.5s delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      if (password === 'password123') {
        // Generate a mock JWT token
        const mockToken = btoa(JSON.stringify({
          sub: '1',
          email,
          name: email.split('@')[0],
          iat: Date.now(),
          exp: Date.now() + 86400000,
        }));

        token.value = mockToken;
        userEmail.value = email;
        userName.value = email.split('@')[0];

        // Show success toast
        const settingsStore = useSettingsStore();
        settingsStore.addToast('Welcome back! Login successful', 'success');

        return true;
      }

      error.value = 'Invalid credentials. Please try again.';

      // Show error toast
      const settingsStore = useSettingsStore();
      settingsStore.addToast('Login failed. Please check your credentials.', 'error');

      return false;
    } catch {
      error.value = 'An unexpected error occurred.';

      // Show error toast
      const settingsStore = useSettingsStore();
      settingsStore.addToast('An error occurred during login. Please try again.', 'error');

      return false;
    } finally {
      isLoading.value = false;
    }
  }

  function logout() {
    token.value = null;
    userName.value = null;
    userEmail.value = null;
    error.value = null;

    // Show logout toast
    const settingsStore = useSettingsStore();
    settingsStore.addToast('You have been logged out successfully', 'info');

    navigateTo('/login');
  }

  function clearError() {
    error.value = null;
  }

  return {
    token,
    userName,
    userEmail,
    isLoading,
    error,
    isAuthenticated,
    login,
    logout,
    clearError,
  };
});
