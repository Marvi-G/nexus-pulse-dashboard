import { useAuthStore } from '~/stores/auth';

export function useAuth() {
  const authStore = useAuthStore();

  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const isLoading = computed(() => authStore.isLoading);
  const error = computed(() => authStore.error);
  const userName = computed(() => authStore.userName);
  const userEmail = computed(() => authStore.userEmail);

  async function login(email: string, password: string) {
    return authStore.login(email, password);
  }

  function logout() {
    authStore.logout();
  }

  function clearError() {
    authStore.clearError();
  }

  return {
    isAuthenticated,
    isLoading,
    error,
    userName,
    userEmail,
    login,
    logout,
    clearError,
  };
}
