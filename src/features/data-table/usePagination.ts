import { ref, computed } from "vue";
import type { Table } from "@tanstack/vue-table";

export function usePagination(table: Table<unknown>) {
  const pageIndex = ref(0);
  const pageSize = ref(10);
  const pageSizeOptions = [10, 20, 30, 40, 50];

  function goToPage(p: number) {
    pageIndex.value = p - 1;
    table.setPageIndex(pageIndex.value);
  } 

  const paginationPages = computed<(number | "...")[]>(() => {
    const totalPages = table.getPageCount();
    const current = pageIndex.value + 1;
    const pages: (number | "...")[] = [];

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);

      if (current <= 3) {
        pages.push(2, 3, "...");
      } else if (current >= totalPages - 2) {
        pages.push("...", totalPages - 2, totalPages - 1);
      } else {
        pages.push("...", current - 1, current, current + 1, "...");
      }

      pages.push(totalPages);
    }

    return pages;
  });

  return {
    pageIndex,
    pageSize,
    pageSizeOptions,
    goToPage,
    paginationPages,
  };
}
