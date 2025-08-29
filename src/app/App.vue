<script setup lang="ts">
import { ref } from "vue";
import SearchInput from "@/features/search-input/ui/SearchInput.vue";
import DownloadBtn from "@/features/download-btn/ui/DownloadBtn.vue";
import CalendarFilter from "@/features/calendar/ui/CalendarFilter.vue";
import SelectInput from "@/shared/ui/SelectInput.vue"; // Импорт нового компонента
import DataTable from "@/features/data-table/ui/DataTable.vue"; // Импорт нового компонента таблицы

const search = ref("");
const calendarRange = ref<[string, string] | null>(null);
const typeFilter = ref<string | null>(null); // Для выбора вида
const statusFilter = ref<string | null>(null); // Для выбора состояния

// Опции для фильтра "Виды"
const typeOptions = [
  { value: "academy", label: "Академия" },
  { value: "university", label: "ВУЗ" },
  { value: "school", label: "Школа" },
];

// Опции для фильтра "Состояния"
const statusOptions = [
  { value: "active", label: "Действующее" },
  { value: "inactive", label: "Недействующее" },
  { value: "unknown", label: "Неизвестно" },
];

// Заглушка для данных таблицы
const tableColumns = [
  { key: "name", label: "Название", sortable: true },
  { key: "region", label: "Регион", sortable: true },
  { key: "address", label: "Адрес", sortable: true },
  { key: "educationLevels", label: "Уровни образования" },
];

const tableData = [
  {
    id: "1",
    name: "Гимназия №1",
    region: "Москва",
    address: "ул. Пушкина, д. 10",
    educationLevels: ["Начальное", "Среднее"],
  },
  {
    id: "2",
    name: "МГУ им. Ломоносова",
    region: "Москва",
    address: "Ленинские горы, д. 1",
    educationLevels: ["Высшее"],
  },
  {
    id: "3",
    name: "Академия искусств",
    region: "Санкт-Петербург",
    address: "Невский пр., д. 5",
    educationLevels: ["Среднее", "Высшее"],
  },
  {
    id: "4",
    name: "Школа №5",
    region: "Казань",
    address: "ул. Баумана, д. 7",
    educationLevels: ["Начальное"],
  },
];
</script>

<template>
  <main>
    <header class="header">
      <h1 class="header__title">Таблица учреждений</h1>
      <div class="header__controls">
        <SearchInput v-model="search" />
        <DownloadBtn />
      </div>
    </header>

    <!-- Десктопные фильтры -->
    <div class="filters desktop-filters">
      <CalendarFilter v-model="calendarRange" />
      <SelectInput
        v-model="typeFilter"
        :options="typeOptions"
        placeholder="Вид"
      />
      <SelectInput
        v-model="statusFilter"
        :options="statusOptions"
        placeholder="Состояние"
      />
    </div>

    <DataTable :columns="tableColumns" :data="tableData" />
  </main>
</template>

<style lang="scss">
@use "@/shared/styles/_mixins.scss" as mixins;
@import "@/shared/styles/_variables.scss";

main {
  background-color: white;
  width: calc(100vw - 6rem); /* 100vw минус отступы с обеих сторон */
  height: calc(100vh - 6rem); /* 100vh минус отступы сверху и снизу */
  border-radius: 1rem;
  margin: 3rem; /* 48px как в макете */
  transition: all 0.3s ease;
  padding: 1.5rem; /* 24px внутренние отступы */
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  /* Адаптивность для мобильных устройств */
  @media (max-width: $breakpoint-tablet) {
    width: calc(100vw - 2rem); /* 100vw минус отступы */
    height: calc(100vh - 2rem); /* 100vh минус отступы */
    margin: 1rem; /* 16px - меньше отступы */
    border-radius: 0.5rem;
    padding: 1rem; /* 16px внутренние отступы */
    gap: 1rem;
  }

  /* Адаптивность для планшетов */
  @media (min-width: #{ $breakpoint-tablet + 1 }) and (max-width: #{$breakpoint-tablet-lg}) {
    width: calc(100vw - 4rem); /* 100vw минус отступы */
    height: calc(100vh - 4rem); /* 100vh минус отступы */
    margin: 2rem; /* 32px - средние отступы */
    padding: 1.25rem; /* 20px внутренние отступы */
    gap: 1.25rem;
  }

  /* Адаптивность для больших экранов */
  @media (min-width: $breakpoint-desktop) {
    width: calc(100vw - 6rem); /* 100vw минус отступы */
    height: calc(100vh - 6rem); /* 100vh минус отступы */
    margin: 3rem; /* 48px как в макете */
    padding: 1.5rem; /* 24px внутренние отступы */
    gap: 1.5rem;
  }
}

/* Хедер */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1.25rem; /* 20px */
  flex-wrap: wrap;
}

.header__title {
  @include mixins.fluid-text(32, 24);
  font-weight: 700;
  color: $heading;
  margin: 0;
  flex-shrink: 0;
}

.header__controls {
  display: flex;
  align-items: center;
  gap: 1.25rem; /* 20px */
  flex-wrap: wrap;
}

/* Адаптивность хедера */
@media (max-width: $breakpoint-tablet) {
  .header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .header__title {
    text-align: center;
  }

  .header__controls {
    justify-content: center;
    gap: 1rem;
  }

  .search-input__field {
    width: 100%;
    min-width: 250px;
  }
}

@media (max-width: $breakpoint-mobile) {
  .header__controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-input__field {
    min-width: auto;
  }

  .download-btn {
    justify-content: center;
  }
}

.download-btn__text {
  font-weight: 500;
}

.filters {
  display: flex;
  gap: 1.25rem; /* 20px */
  flex-wrap: wrap;
}

/* Адаптивность для мобильных устройств */
@media (max-width: $breakpoint-tablet) {
  .filters {
    flex-direction: column;
    gap: 1rem;
  }
}

@media (min-width: #{$breakpoint-tablet + 1}) {
  .mobile-filters {
    display: none; // Скрываем мобильные фильтры на десктопе
  }
}
</style>
