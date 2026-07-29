import { vi } from 'vitest';
import { ref } from 'vue';

/**
 * Vitest setup file — provides Nuxt auto-imports as globals
 * so stores and composables that use `useCookie`, `navigateTo`, etc. work.
 */

// Cookie store (simple in-memory mock)
const cookieStore: Record<string, any> = {};

// Mock useCookie — returns a ref that persists in memory during the test
globalThis.useCookie = (name: string, _opts?: any) => {
  if (!(name in cookieStore)) {
    cookieStore[name] = ref(null);
  }
  return cookieStore[name];
};

// Mock navigateTo — no-op in tests
globalThis.navigateTo = vi.fn();

// Reset cookie store between tests
afterEach(() => {
  Object.keys(cookieStore).forEach((key) => {
    cookieStore[key].value = null;
  });
});
