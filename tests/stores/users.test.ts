import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useUsersStore } from '../../stores/users';

describe('users store', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('loads mock users on init', () => {
    const store = useUsersStore();
    expect(store.allUsers.length).toBeGreaterThanOrEqual(50);
  });

  it('filters users by search query', () => {
    const store = useUsersStore();
    store.setSearch('emma');
    expect(store.filteredUsers.length).toBeGreaterThan(0);
    expect(
      store.filteredUsers.every(
        (u) =>
          u.name.toLowerCase().includes('emma') ||
          u.email.toLowerCase().includes('emma')
      )
    ).toBe(true);
  });

  it('resets to page 1 when search changes', () => {
    const store = useUsersStore();
    store.setPage(3);
    expect(store.currentPage).toBe(3);
    store.setSearch('test');
    expect(store.currentPage).toBe(1);
  });

  it('sorts users by name ascending', () => {
    const store = useUsersStore();
    store.setSort('name');
    const names = store.filteredUsers.map((u) => u.name);
    const sorted = [...names].sort();
    expect(names).toEqual(sorted);
  });

  it('sorts users by name descending on second click', () => {
    const store = useUsersStore();
    store.setSort('name'); // asc
    store.setSort('name'); // desc
    const names = store.filteredUsers.map((u) => u.name);
    const sorted = [...names].sort().reverse();
    expect(names).toEqual(sorted);
  });

  it('paginates correctly', () => {
    const store = useUsersStore();
    expect(store.paginatedUsers.length).toBe(10);
    expect(store.totalPages).toBe(Math.ceil(store.allUsers.length / 10));
  });

  it('deletes a user', () => {
    const store = useUsersStore();
    const initialCount = store.allUsers.length;
    store.deleteUser(1);
    expect(store.allUsers.length).toBe(initialCount - 1);
    expect(store.allUsers.find((u) => u.id === 1)).toBeUndefined();
  });
});
