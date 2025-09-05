<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { keepPreviousData, useQuery } from "@tanstack/vue-query";
import Filters from "@/entities/Filters.vue";
import PrevArrow from "@/app/images/PrevArrow.svg";
import NextArrow from "@/app/images/NextArrow.svg";
import $style from "./DataTable.module.scss";
import {
  fetchFederalDistricts,
  type FederalDistricts,
} from "@/app/axios/federalDistricts";
import { fetchRegions, type Regions } from "@/app/axios/regions";
import type { School } from "@/app/App.vue";
import DataTableHeader from "./DataTableHeader.vue";
import DataTableBody from "./DataTableBody.vue";
import type { Table } from "@tanstack/vue-table";

type Props = {
  isLoading: boolean;
  schools: School[];
  selectable?: boolean;
  regionFilter: string | null;
  pageIndex: number;
  pageSize: number;
  table: Table<School>;
  selectedIds: Set<string>;
  allSelected: boolean;
  toggleOne: (id?: string | number) => void;
  toggleAll: () => void;
  totalPages: number;
  currentPage: number;
  statusFilter: string | null;
  typeFilter: string | null;

};
// props/emit
const {
  totalPages,
  currentPage,
  selectedIds,
  table,
  isLoading,
  schools,
  selectable,
  regionFilter,
  pageSize,
} = defineProps<Props>();
const emit = defineEmits<{
  (e: "update:selected", value: Set<string>): void;
  (e: "update:regionFilter", value: string): void;
  (e: "update:pageIndex", value: number): void;
  (e: "update:pageSize", value: number): void;
  (e: "update:statusFilter", value: string): void;
  (e: "update:typeFilter", value: string): void;
}>();

// === Фильтры ===
const calendarRange = ref<[string, string] | null>(null);

interface Option {
  value: string | number;
  label: string;
}
interface OptionGroup {
  label: string;
  options: Option[];
}

const typeOptions: Option[] = [
  { value: "academy", label: "Академия" },
  { value: "university", label: "ВУЗ" },
  { value: "school", label: "Школа" },
];
const statusOptions: Option[] = [
  { value: "active", label: "Действующее" },
  { value: "inactive", label: "Недействующее" },
  { value: "unknown", label: "Неизвестно" },
];

const regionOptions = ref<OptionGroup[]>([]);

// --- Vue Query для регионов ---
const { data: federalData } = useQuery<FederalDistricts>({
  queryKey: ["federalDistricts"],
  queryFn: fetchFederalDistricts,
  placeholderData: keepPreviousData,
});

const { data: regionData, isPending } = useQuery<Regions>({
  queryKey: ["regions"],
  queryFn: fetchRegions,
  placeholderData: keepPreviousData,
});

// автоматически формируем options после загрузки данных
watch([federalData, regionData], () => {
  const federalDistricts = Array.isArray(federalData.value)
    ? federalData.value
    : [];
  const regions = Array.isArray(regionData.value) ? regionData.value : [];

  regionOptions.value = [
    {
      label: "Федеральные округа",
      options: federalDistricts.map((fd) => ({
        value: `federal-${fd.id}`,
        label: fd.name,
      })),
    },
    {
      label: "Регионы",
      options: regions.map((r) => ({ value: `region-${r.id}`, label: r.name })),
    },
  ];
});

// === Обновление фильтров ===
function onUpdateCalendarRange(val: [string, string]) {
  calendarRange.value = val;
}
function onUpdateTypeFilter(val: string) {
  emit("update:typeFilter", val)
}
function onUpdateStatusFilter(val: string) {
  emit("update:statusFilter", val)
}
function onUpdateRegionFilter(val: string) {
  emit("update:regionFilter", val);
}

// === Таблица ===
const pageSizeOptions = [10, 20, 30, 40, 50];

console.log(schools);

// --- Выбор строк ---
// const { allSelected, selectedIds, toggleAll, toggleOne } = useSelect({
//   emit,
//   schools: schools,
//   selectable,
// });

// --- Пагинация с "..." ---
const paginationPages = computed<(number | "...")[]>(() => {
  const pages: (number | "...")[] = [];
  const current = currentPage; // число 1-based
  if (!totalPages) return [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (current <= 3) pages.push(2, 3, "...");
    else if (current >= totalPages - 2)
      pages.push("...", totalPages - 2, totalPages - 1);
    else pages.push("...", current - 1, current, current + 1, "...");
    pages.push(totalPages);
  }
  return pages;
});

function goToPage(p: number) {
  if (!p || p < 1 || p > totalPages) return;
  emit("update:pageIndex", p - 1); // передаем 0-based index родителю
}
function changePageSize(size: number) {
  emit("update:pageSize", size);
}
</script>

<template>
  <Filters
    :isPending="isPending"
    :calendarRange="calendarRange"
    :typeFilter="typeFilter"
    :statusFilter="statusFilter"
    :regionFilter="regionFilter"
    :typeOptions="typeOptions"
    :statusOptions="statusOptions"
    :regionOptions="regionOptions"
    @update:calendarRange="onUpdateCalendarRange"
    @update:typeFilter="onUpdateTypeFilter"
    @update:statusFilter="onUpdateStatusFilter"
    @update:regionFilter="onUpdateRegionFilter"
  />
  <div :class="$style.dataTableContainer">
    <div :class="$style.dataTableScroll">
      <table :class="$style.dataTable" cellspacing="0">
        <!-- Header -->
        <thead>
          <DataTableHeader
            :headerGroups="table.getHeaderGroups()"
            :allSelected="allSelected"
            :toggleAll="toggleAll"
          />
        </thead>

        <!-- Body -->
        <tbody :class="$style.dataTableBody">
          <DataTableBody
            :isLoading="isLoading"
            :rows="table.getRowModel().rows"
            :selectedIds="selectedIds"
            :selectable="selectable"
            :toggleOne="toggleOne"
          />
        </tbody>
      </table>
      <!-- Pagination -->
      <div :class="$style.pagination">
        <div :class="$style.paginationLeft">
          <!-- Кнопка "Предыдущая" -->
          <button
            :class="$style.pageBtn"
            :disabled="currentPage <= 1"
            @click="goToPage(currentPage - 1)"
          >
            <PrevArrow />
          </button>

          <!-- Страницы -->
          <div :class="$style.pageNumbers">
            <button
              v-for="p in paginationPages"
              :key="p"
              :class="[
                $style.pageNumber,
                { [$style.active]: p === currentPage },
              ]"
              @click="typeof p === 'number' && goToPage(p)"
              :disabled="p === '...'"
            >
              {{ p }}
            </button>
          </div>

          <!-- Кнопка "Следующая" -->

          <button
            :class="$style.pageBtn"
            :disabled="currentPage >= totalPages"
            @click="goToPage(currentPage + 1)"
          >
            <NextArrow />
          </button>
        </div>

        <!-- Количество элементов на странице -->
        <div :class="$style.rowsPerPage">
          <span>Показывать</span>
          <select
            :value="pageSize"
            @change="
              (e: Event) =>
                changePageSize(+(e.target as HTMLSelectElement).value)
            "
          >
            <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>
