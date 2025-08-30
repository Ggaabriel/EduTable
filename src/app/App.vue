<script setup lang="ts">
import { ref, computed, provide } from "vue";

import CalendarFilter from "@/features/calendar/ui/CalendarFilter.vue";
import SelectInput from "@/shared/ui/SelectInput.vue";
import DataTable from "@/features/data-table/ui/DataTable.vue";
import styles from "./App.module.scss";
import { columns } from "./columns";
import Header from "@/features/Header/Header.vue";

const searchQuery = ref<string>("");

const regions = ref<
  Array<{
    id: string;
    name: string;
    region: string;
    address: string;
    educationLevels: string[];
    type: string;
    status: string;
  }>
>([
  {
    id: "1",
    name: "Академия Наук",
    region: "Москва",
    address: "ул. Академическая, д. 1",
    educationLevels: ["Высшее"],
    type: "academy",
    status: "active",
  },
  {
    id: "2",
    name: "Московский Государственный Университет",
    region: "Москва",
    address: "ул. Университетская, д. 2",
    educationLevels: ["Высшее"],
    type: "university",
    status: "active",
  },
  {
    id: "3",
    name: "Школа №1",
    region: "Санкт-Петербург",
    address: "ул. Школьная, д. 3",
    educationLevels: ["Начальное", "Среднее"],
    type: "school",
    status: "inactive",
  },
]);

const filtered = computed(() => {
  const q = searchQuery.value.trim().toLowerCase();
  if (!q) return regions.value;
  return regions.value.filter((r) => r.name.toLowerCase().includes(q));
});

// const filtered = computed(() => {
//   const q = search.value.trim().toLowerCase();

//   return tableData.value.filter((r) => {
//     // 1. Текстовый поиск
//     const matchesSearch =
//       !q ||
//       [r.name, r.region, r.address] // добавляем новые поля
//         .some((v) => v?.toLowerCase().includes(q));

//     // 4. Дата
//     const matchesDate =
//       !calendarRange.value || new Date(r.date) >= new Date(calendarRange.value);

//     return matchesSearch && matchesDate;
//   });
// });
</script>

<template>
  <main :class="styles.main">
    <Header
      :searchQuery="searchQuery"
      @update:searchQuery="(val: string) => (searchQuery = val)"
    />
    <DataTable :columns="columns" :data="filtered" :selectable="true" />
  </main>
</template>
