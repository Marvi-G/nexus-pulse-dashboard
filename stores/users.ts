import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import type { User } from '~/types/user';
import { mockUsers } from '~/utils/mockData';

export type SortDirection = 'asc' | 'desc' | null;

export interface SortConfig {
  key: keyof User | null;
  direction: SortDirection;
}

export const useUsersStore = defineStore('users', () => {
  const allUsers = ref<User[]>([...mockUsers]);
  const searchQuery = ref('');
  const currentPage = ref(1);
  const itemsPerPage = ref(10);
  const sortConfig = ref<SortConfig>({ key: null, direction: null });
  const isLoading = ref(false);

  const filteredUsers = computed(() => {
    let result = [...allUsers.value];

    // Filter by search query
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase();
      result = result.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      );
    }

    // Sort
    if (sortConfig.value.key && sortConfig.value.direction) {
      const key = sortConfig.value.key;
      const dir = sortConfig.value.direction;
      result.sort((a, b) => {
        const aVal = a[key];
        const bVal = b[key];
        if (aVal < bVal) return dir === 'asc' ? -1 : 1;
        if (aVal > bVal) return dir === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  });

  const paginatedUsers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value;
    return filteredUsers.value.slice(start, start + itemsPerPage.value);
  });

  const totalPages = computed(() =>
    Math.ceil(filteredUsers.value.length / itemsPerPage.value)
  );

  function setSearch(query: string) {
    searchQuery.value = query;
    currentPage.value = 1;
  }

  function setSort(key: keyof User) {
    if (sortConfig.value.key === key) {
      if (sortConfig.value.direction === 'asc') {
        sortConfig.value.direction = 'desc';
      } else if (sortConfig.value.direction === 'desc') {
        sortConfig.value.key = null;
        sortConfig.value.direction = null;
      }
    } else {
      sortConfig.value.key = key;
      sortConfig.value.direction = 'asc';
    }
  }

  function setPage(page: number) {
    currentPage.value = page;
  }

  function deleteUser(id: number) {
    allUsers.value = allUsers.value.filter((u) => u.id !== id);
  }

  function updateUser(updated: User) {
    const idx = allUsers.value.findIndex((u) => u.id === updated.id);
    if (idx !== -1) {
      allUsers.value[idx] = { ...updated };
    }
  }

  async function fetchUsers() {
    isLoading.value = true;
    await new Promise((resolve) => setTimeout(resolve, 500));
    isLoading.value = false;
  }

  return {
    allUsers,
    searchQuery,
    currentPage,
    itemsPerPage,
    sortConfig,
    isLoading,
    filteredUsers,
    paginatedUsers,
    totalPages,
    setSearch,
    setSort,
    setPage,
    deleteUser,
    updateUser,
    fetchUsers,
  };
});
