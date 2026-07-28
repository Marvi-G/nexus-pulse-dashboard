import { computed } from 'vue';

interface UsePaginationOptions {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}

export function usePagination({ totalItems, itemsPerPage, currentPage }: UsePaginationOptions) {
  const totalPages = computed(() => Math.ceil(totalItems / itemsPerPage));

  const startItem = computed(() => {
    if (totalItems.value === 0) return 0;
    return (currentPage - 1) * itemsPerPage + 1;
  });

  const endItem = computed(() => {
    const end = currentPage * itemsPerPage;
    return Math.min(end, totalItems.value);
  });

  const visiblePages = computed(() => {
    const pages: number[] = [];
    const total = totalPages.value;
    const current = currentPage;
    const maxVisible = 5;

    if (total <= maxVisible) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      const half = Math.floor(maxVisible / 2);
      let start = Math.max(1, current - half);
      const end = Math.min(total, start + maxVisible - 1);

      if (end - start < maxVisible - 1) {
        start = Math.max(1, end - maxVisible + 1);
      }

      for (let i = start; i <= end; i++) pages.push(i);
    }

    return pages;
  });

  const hasNext = computed(() => currentPage < totalPages.value);
  const hasPrev = computed(() => currentPage > 1);

  return {
    totalPages,
    startItem,
    endItem,
    visiblePages,
    hasNext,
    hasPrev,
  };
}
