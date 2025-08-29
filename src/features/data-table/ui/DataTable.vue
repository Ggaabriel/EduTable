<script setup lang="ts">
import { ref } from "vue";
import TableHeader from "@/features/data-table/ui/table-header/TableHeader.vue";
import TableRow from "@/features/data-table/ui/table-row/TableRow.vue";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface Row {
  id: string;
  [key: string]: unknown; // Используем unknown вместо any, будет уточнено при получении данных с сервера
}

const props = defineProps<{
  columns: Column[];
  data: Row[];
}>();

const selectedRows = ref<string[]>([]);

const toggleRowSelection = (id: string) => {
  const index = selectedRows.value.indexOf(id);
  if (index > -1) {
    selectedRows.value.splice(index, 1);
  } else {
    selectedRows.value.push(id);
  }
};

const allRowsSelected = ref(false);

const toggleAllRowsSelection = () => {
  if (allRowsSelected.value) {
    selectedRows.value = [];
  } else {
    selectedRows.value = props.data.map((row) => row.id);
  }
  allRowsSelected.value = !allRowsSelected.value;
};

const sortedColumn = ref<string | null>(null);
const sortDirection = ref<"asc" | "desc">("asc");

const sortByColumn = (key: string) => {
  if (sortedColumn.value === key) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortedColumn.value = key;
    sortDirection.value = "asc";
  }
  // Здесь будет логика для сортировки данных
  console.log(`Сортировка по ${key}, направление: ${sortDirection.value}`);
};
</script>

<template>
  <div class="data-table">
    <!-- Мобильная шапка таблицы (Выбрать все) -->
    <div class="mobile-table-header">
      <div class="checkbox-cell">
        <input
          type="checkbox"
          :checked="allRowsSelected"
          @change="toggleAllRowsSelection"
        />
        <span>Выбрать все</span>
      </div>
    </div>

    <!-- Заголовки таблицы для десктопа -->
    <TableHeader
      :columns="columns"
      :allRowsSelected="allRowsSelected"
      :sortedColumn="sortedColumn"
      :sortDirection="sortDirection"
      @toggleAllRowsSelection="toggleAllRowsSelection"
      @sortByColumn="sortByColumn"
    />

    <!-- Тело таблицы -->
    <div class="table-body">
      <TableRow
        v-for="row in data"
        :key="row.id"
        :row="row"
        :columns="columns"
        :selectedRows="selectedRows"
        @toggleRowSelection="toggleRowSelection"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
@use "@/shared/styles/_mixins.scss" as mixins;
@import "@/shared/styles/_variables.scss";

$checkbox-col-width: 50px; // Ширина колонки для чекбокса

.data-table {
  width: 100%;
  overflow-x: auto; // Горизонтальная прокрутка для десктопа
  border: 1px solid $border-light;
  border-radius: 0.5rem;
  font-family: Arial, sans-serif; // Временный шрифт

  @media (max-width: $breakpoint-tablet) {
    border: none; // Убираем границу для общего контейнера на мобильных
    overflow-x: hidden; // Убираем прокрутку на мобильных, так как это карточки
  }
}

.mobile-table-header {
  display: none; // Скрываем по умолчанию

  @media (max-width: $breakpoint-tablet) {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem; // Увеличиваем отступы, чтобы шапка была больше
    background-color: $background-light; // Фон шапки
    border-bottom: 1px solid $border-light;
    position: sticky; // Делаем шапку "липкой"
    top: 0;
    z-index: 10; // Чтобы шапка была поверх других элементов при прокрутке

    .checkbox-cell {
      flex: unset; // Сбрасываем flex, чтобы не конфликтовал с родительским
      width: auto; // Автоматическая ширина
      padding: 0; // Сбрасываем padding
      border-bottom: none; // Убираем пунктирную линию
      margin-bottom: 0; // Убираем отступ
      display: flex;
      align-items: center;
      gap: 0.5rem;

      input[type="checkbox"] {
        width: 20px; // Немного увеличим размер чекбокса
        height: 20px;
      }
    }
  }
}

.table-body {
  @media (max-width: $breakpoint-tablet) {
    display: flex;
    flex-direction: column;
    gap: 1rem; // Отступ между карточками
  }
}
</style>
