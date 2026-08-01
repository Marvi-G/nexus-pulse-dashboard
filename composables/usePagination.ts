import { computed, reactive, type ComputedRef, type Ref } from 'vue';

type MaybeRefOrComputed<T> = T | Ref<T> | ComputedRef<T>;

interface UsePaginationOptions {
  totalItems: MaybeRefOrComputed<number>;
  itemsPerPage: MaybeRefOrComputed<number>;
  currentPage: MaybeRefOrComputed<number>;
}

export function usePagination({ totalItems, itemsPerPage, currentPage }: UsePaginationOptions) {
  const getVal = <T>(val: MaybeRefOrComputed<T>): T => {
    return (val && typeof val === 'object' && 'value' in val) ? val.value : val;
  };

  const totalPages = computed(() => Math.ceil(getVal(totalItems) / getVal(itemsPerPage)));

  const startItem = computed(() => {
    const total = getVal(totalItems);
    if (total === 0) return 0;
    return (getVal(currentPage) - 1) * getVal(itemsPerPage) + 1;
  });

  const endItem = computed(() => {
    const end = getVal(currentPage) * getVal(itemsPerPage);
    return Math.min(end, getVal(totalItems));
  });

  const visiblePages = computed(() => {
    const pages: number[] = [];
    const total = totalPages.value;
    const current = getVal(currentPage);
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

  const hasNext = computed(() => getVal(currentPage) < totalPages.value);
  const hasPrev = computed(() => getVal(currentPage) > 1);

  return reactive({
    totalPages,
    startItem,
    endItem,
    visiblePages,
    hasNext,
    hasPrev,
  });
}