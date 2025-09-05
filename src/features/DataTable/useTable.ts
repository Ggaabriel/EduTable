import type { School } from "@/app/App.vue";
import type { TableHeaders } from "@/app/tableHeaders";
import {
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
  type SortingState,
} from "@tanstack/vue-table";
import { ref, type Ref } from "vue";

interface Props {
  schools: Ref<School[]>;
  tableHeaders: TableHeaders;
  pageIndex: Ref<number>;
  pageSize: Ref<number>;

}
export const useTable = ({
  schools,
  tableHeaders,
  pageIndex,
  pageSize
}: Props) => {
  const sorting = ref<SortingState>([]);
  console.log(schools);
  const table = useVueTable({
    autoResetPageIndex: false,
    manualPagination: true,
    get data() {
      return schools;
    },
    get columns() {
      return tableHeaders;
    },
    state: {
      get sorting() {
        return sorting.value;
      },
      get pagination() {
        return { pageIndex: pageIndex.value, pageSize:pageSize.value };
      },
    },
    onSortingChange: (updater) => {
      sorting.value =
        typeof updater === "function" ? updater(sorting.value) : updater;
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex: pageIndex.value, pageSize: pageSize.value })
          : updater;
      pageIndex.value = next.pageIndex
      pageSize.value = next.pageSize
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return { table };
};
