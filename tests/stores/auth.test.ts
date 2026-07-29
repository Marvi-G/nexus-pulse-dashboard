import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useAuthStore } from '../../stores/auth';

describe('auth store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('starts with isAuthenticated as false', () => {
    const store = useAuthStore();
    expect(store.isAuthenticated).toBe(false);
  });

  it('sets token on successful login', async () => {
    const store = useAuthStore();
    const result = await store.login('test@example.com', 'password123');
    expect(result).toBe(true);
    expect(store.token).toBeTruthy();
    expect(store.userEmail).toBe('test@example.com');
    expect(store.isAuthenticated).toBe(true);
  });

  it('fails login with wrong password', async () => {
    const store = useAuthStore();
    const result = await store.login('test@example.com', 'wrongpassword');
    expect(result).toBe(false);
    expect(store.token).toBeNull();
    expect(store.isAuthenticated).toBe(false);
    expect(store.error).toBe('Invalid credentials. Please try again.');
  });

  it('clears state on logout', async () => {
    const store = useAuthStore();
    await store.login('test@example.com', 'password123');
    expect(store.isAuthenticated).toBe(true);

    store.logout();
    expect(store.token).toBeNull();
    expect(store.userName).toBeNull();
    expect(store.userEmail).toBeNull();
  });
});
