import { ref } from "vue";
import { useVueTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel } from "@tanstack/vue-table";
import type { ColumnDef, SortingState } from "@tanstack/vue-table";

export function useTableCore(props: { data: any[]; columns: ColumnDef<any, unknown>[] }, pageIndex: any, pageSize: any) {
  const sorting = ref<SortingState>([]);

  const table = useVueTable({
    get data() {
      return props.data;
    },
    get columns() {
      return props.columns;
    },
    state: {
      get sorting() {
        return sorting.value;
      },
      get pagination() {
        return { pageIndex: pageIndex.value, pageSize: pageSize.value };
      },
    },
    onSortingChange: (updater) => {
      sorting.value = typeof updater === "function" ? updater(sorting.value) : updater;
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex: pageIndex.value, pageSize: pageSize.value })
          : updater;
      pageIndex.value = next.pageIndex;
      pageSize.value = next.pageSize;
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return {
    sorting,
    table,
  };
}
