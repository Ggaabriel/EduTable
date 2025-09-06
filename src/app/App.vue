<script setup lang="ts">
import { ref, computed, watch, type Ref } from "vue";
import { useQuery } from "@tanstack/vue-query";
import DataTable from "@/features/DataTable/DataTable.vue";
import styles from "./App.module.scss";
import { tableHeaders } from "./tableHeaders";
import Header from "@/features/Header/Header.vue";
import NotificationBanner from "@/shared/ui/NotificationBanner.vue";
import { fetchSchools } from "./axios/schools";
import { useTable } from "@/features/DataTable/useTable";
import { useSelect } from "@/features/DataTable/useSelect";
import { fetchDownload } from "./axios/download";

const searchQuery = ref<string>("");
const regionFilter = ref<string>("");
const pageIndex: Ref<number, number> = ref(0);
const pageSize = ref(10);

function onUpdateRegionFilter(val: string) {
  regionFilter.value = val;
  pageIndex.value = 0;
}
function getSchoolParams() {
  if (!regionFilter.value) return {};

  if (regionFilter.value.startsWith("federal-")) {
    const federalId = regionFilter.value.split("-")[1];
    return { federal_district_id: +federalId };
  }

  if (regionFilter.value.startsWith("region-")) {
    const regionId = regionFilter.value.split("-")[1];
    return { region_id: +regionId };
  }

  return {};
}

// тип школы
export interface School {
  id: string;
  name: string;
  region: string;
  address: string;
  educationLevels: string[];
  type: string;
  status: string;
  federalDistrict: string;
}

// === Запрос школ через vue-query ===
const { data, isFetching, error, refetch } = useQuery({
  queryKey: ["schools", regionFilter, pageIndex, pageSize], // ключи — рефы ок
  queryFn: () => {
    const p = getSchoolParams();
    // сервер у тебя 1-based — конвертим
    return fetchSchools(pageSize.value, pageIndex.value + 1, p);
  },
  enabled: computed(() => regionFilter.value !== ""),
  // сразу приводим к удобной структуре
  select: (api) => ({
    rows: api.schools, // массив для таблицы
    page: api.page, // 1-based с бэка
    pages: api.pages, // всего страниц
    total: api.totalCount, // всего записей
  }),
  retry: 0,
});

// Чистый массив для таблицы
const schools = computed(() => data.value?.rows ?? []);

//const totalCount = computed(() => data.value?.total ?? 0);
const totalPages = computed(() => data.value?.pages ?? 0); // общее число страниц (серв)

const selectable = ref(true);

watch(regionFilter, () => {
  if (regionFilter.value) {
    refetch();
  }
});
watch(pageSize, () => {
  if (pageSize.value) {
    refetch();
  }
});

// === Фильтрация ===
const typeFilter = ref<string | null>(null);
const statusFilter = ref<string | null>(null);

const filtered = computed(() => {
  if (!schools.value) return [];

  let result = schools.value;

  // Поиск по имени
  const q = searchQuery.value.trim().toLowerCase();
  if (q) {
    result = result.filter((r) => r.name.toLowerCase().includes(q));
  }

  // Фильтр по типу
  if (typeFilter.value) {
    result = result.filter((r) => r.type === typeFilter.value);
  }

  // Фильтр по статусу
  if (statusFilter.value) {
    result = result.filter((r) => r.status === statusFilter.value);
  }

  return result;
});

function updateTypeFilter(val: string) {
  typeFilter.value = val;
}
function updateStatusFilter(val: string) {
  statusFilter.value = val;
}

// === Состояние нотификейшена ===
const bannerVisible = ref(false);
const bannerMessage = ref("");

const selectedIds = ref<Set<string>>(new Set());

const { allSelected, toggleAll, toggleOne } = useSelect({
  schools: filtered,
  selectable,
  selectedIds,
});

watch(error, (err) => {
  if (err) {
    bannerMessage.value = "Ошибка загрузки школ. Проверьте соединение.";
    bannerVisible.value = true;
  }
});

function handleRetry() {
  bannerVisible.value = false;
  refetch();
}

function updatePageSize(v: number) {
  pageSize.value = v;
}
function updatePageIndex(v: number) {
  pageIndex.value = v;
}

const { table } = useTable({
  schools: filtered,
  tableHeaders,
  pageIndex,
  pageSize,
});
const currentPage = computed(() => pageIndex.value + 1);

async function downloadFromUrl() {
  const p = getSchoolParams();
  const url = await fetchDownload(pageSize.value, pageIndex.value + 1, p);
  const link = document.createElement("a");
  link.href = url;
  document.body.appendChild(link);
  link.click();
  link.remove();
}
function killFilters() {
  typeFilter.value = null;
  statusFilter.value = null;
  regionFilter.value = "";
}
</script>

<template>
  <main :class="styles.main">
    <Header
      :searchQuery="searchQuery"
      @update:searchQuery="(val: string) => (searchQuery = val)"
      :downloadFromUrl="downloadFromUrl"
      :killFilters="killFilters"
    />

    <NotificationBanner
      :message="bannerMessage"
      :visible="bannerVisible"
      @retry="handleRetry"
      @close="bannerVisible = false"
    />

    <DataTable
      :typeFilter="typeFilter"
      :statusFilter="statusFilter"
      :currentPage="currentPage"
      :totalPages="totalPages"
      :allSelected="allSelected"
      :toggleAll="toggleAll"
      :toggleOne="toggleOne"
      :selectedIds="selectedIds"
      :table="table"
      @update:pageSize="updatePageSize"
      @update:pageIndex="updatePageIndex"
      @update:statusFilter="updateStatusFilter"
      @update:typeFilter="updateTypeFilter"
      :pageIndex="pageIndex"
      :pageSize="pageSize"
      :isLoading="isFetching"
      @update:regionFilter="onUpdateRegionFilter"
      :regionFilter="regionFilter"
      :selectable="true"
      :killFilters="killFilters"
    />
  </main>
</template>
