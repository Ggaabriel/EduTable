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
  pageIndex: number;
  pageSize: number;
  emit: {
    (e: "update:pageIndex", value: number): void;
    (e: "update:pageSize", value: number): void;
  };
}
export const useTable = ({
  schools,
  tableHeaders,
  pageIndex,
  pageSize,
  emit,
}: Props) => {
  const sorting = ref<SortingState>([]);
  console.log(schools);
  const table = useVueTable({
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
        return { pageIndex, pageSize };
      },
    },
    onSortingChange: (updater) => {
      sorting.value =
        typeof updater === "function" ? updater(sorting.value) : updater;
    },
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex: pageIndex, pageSize: pageSize })
          : updater;
      emit("update:pageIndex", next.pageIndex);
      emit("update:pageSize", next.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return { table };
};
