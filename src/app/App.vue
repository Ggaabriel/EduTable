<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useQuery } from "@tanstack/vue-query";
import DataTable from "@/features/DataTable/DataTable.vue";
import styles from "./App.module.scss";
import { tableHeaders } from "./tableHeaders";
import Header from "@/features/Header/Header.vue";
import NotificationBanner from "@/shared/ui/NotificationBanner.vue";
import { fetchSchools } from "./axios/schools";

const searchQuery = ref<string>("");
const regionFilter = ref<string | null>(null);
const pageIndex = ref(0);
const pageSize = ref(10);

function onUpdateRegionFilter(val: string) {
  regionFilter.value = val;
  if (val.startsWith("federal-")) console.log("federal=", val.split("-")[1]);
  else if (val.startsWith("region-")) console.log("region=", val.split("-")[1]);
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
const {
  data: schools,
  error,
  isLoading,
  refetch,
} = useQuery({
  queryKey: computed(() => ["schools", regionFilter.value]), // именно .value
  queryFn: () => {
    const params = getSchoolParams();
    return fetchSchools(10, 1, params);
  },
  enabled: computed(() => regionFilter.value !== null),
  retry: 0,
});
watch(regionFilter, () => {
  if (regionFilter.value) {
    refetch();
  }
});



// === Фильтрация ===
const filtered = computed(() => {
  if (!schools.value) return [];
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return schools.value;
  return schools.value.filter((r) => r.name.toLowerCase().includes(q));
});

// === Состояние нотификейшена ===
const bannerVisible = ref(false);
const bannerMessage = ref("");

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
</script>

<template>
  <main :class="styles.main">
    <Header
      :searchQuery="searchQuery"
      @update:searchQuery="(val: string) => (searchQuery = val)"
    />

    <NotificationBanner
      :message="bannerMessage"
      :visible="bannerVisible"
      @retry="handleRetry"
      @close="bannerVisible = false"
    />

    <DataTable
      
      :pageIndex="pageIndex"
      :pageSize="pageSize"
      :isLoading="isLoading"
      @update:regionFilter="onUpdateRegionFilter"
      :regionFilter="regionFilter"
      :tableHeaders="tableHeaders"
      :schools="filtered"
      :selectable="true"
    />
  </main>
</template>
