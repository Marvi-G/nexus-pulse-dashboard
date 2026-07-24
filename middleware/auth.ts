export default defineNuxtRouteMiddleware((to) => {
  // Allow access to login page without auth
  if (to.path === '/login') return;

  const token = useCookie<string | null>('auth_token');

  if (!token.value) {
    return navigateTo('/login');
  }
});
