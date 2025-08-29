<script setup lang="ts">
interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface Row {
  id: string;
  [key: string]: unknown;
}

const props = defineProps<{
  columns: Column[];
  allRowsSelected: boolean;
  sortedColumn: string | null;
  sortDirection: "asc" | "desc";
}>();

const emit = defineEmits<{
  (e: "toggleAllRowsSelection"): void;
  (e: "sortByColumn", key: string): void;
}>();

const handleToggleAllRows = () => {
  emit("toggleAllRowsSelection");
};

const handleSortByColumn = (key: string) => {
  emit("sortByColumn", key);
};
</script>

<template>
  <div class="table-header">
    <div class="header-cell checkbox-cell">
      <input
        type="checkbox"
        :checked="allRowsSelected"
        @change="handleToggleAllRows"
      />
    </div>
    <div
      v-for="column in columns"
      :key="column.key"
      class="header-cell"
      :class="{ sortable: column.sortable }"
      @click="column.sortable && handleSortByColumn(column.key)"
    >
      {{ column.label }}
      <span v-if="column.sortable" class="sort-icon">
        <svg
          v-if="sortedColumn === column.key && sortDirection === 'asc'"
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 0L0.669873 6L9.33013 6L5 0Z" fill="currentColor" />
        </svg>
        <svg
          v-else-if="sortedColumn === column.key && sortDirection === 'desc'"
          width="10"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 6L9.33013 0L0.669873 0L5 6Z" fill="currentColor" />
        </svg>
        <svg
          v-else
          width="10"
          height="12"
          viewBox="0 0 10 12"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 0L0.669873 6L9.33013 6L5 0Z" fill="#C4C4C4" />
          <path d="M5 12L9.33013 6L0.669873 6L5 12Z" fill="#C4C4C4" />
        </svg>
      </span>
    </div>
  </div>
</template>

<style scoped lang="scss">
@import "@/shared/styles/_variables.scss";

$checkbox-col-width: 50px; // Ширина колонки для чекбокса

.table-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid $border-light;
  background-color: $background-light;
  font-weight: 600;
  color: $text-dark; // Цвет текста заголовков по умолчанию
  padding: 0.75rem 1rem; // 12px сверху/снизу, 16px по бокам
  min-width: calc(
    900px + #{$checkbox-col-width}
  ); // Минимальная ширина для десктопа
  flex-wrap: nowrap; // Убеждаемся, что заголовки не переносятся на новую строку
  gap: 1px; // Добавляем промежуток между элементами

  @media (max-width: $breakpoint-tablet) {
    display: none; // Скрываем заголовки таблицы на мобильных
  }
}

.header-cell {
  flex: 1; // Равномерное распределение пространства
  min-width: 150px; // Минимальная ширина для предотвращения схлопывания
  padding: 0.75rem 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  user-select: none;
  // border-right: 1px solid $border-light; // Граница будет через gap

  &:last-child {
    border-right: none;
  }

  &.sortable {
    &:hover {
      background-color: lighten($background-light, 2%);
    }
  }

  .sort-icon {
    display: flex;
    align-items: center;
    height: 100%;

    svg {
      transition:
        fill 0.2s ease,
        transform 0.2s ease;
      path {
        fill: currentColor; // Используем currentColor для динамического изменения цвета
      }
    }

    .sort-icon-active {
      fill: $text-dark; // Активная стрелка будет черной
    }

    .sort-icon-inactive {
      fill: #c4c4c4; // Неактивная стрелка будет серой
    }
  }
}

.checkbox-cell {
  flex: 0 0 $checkbox-col-width; // Используем переменную для ширины
  justify-content: center;
  padding: 0;

  input[type="checkbox"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
  }
}
</style>
