<script setup lang="ts">
import TableCell from "@/features/data-table/ui/table-cell/TableCell.vue";

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
  row: Row;
  columns: Column[];
  selectedRows: string[];
}>();

const emit = defineEmits<{
  (e: "toggleRowSelection", id: string): void;
}>();

const handleCheckboxChange = () => {
  emit("toggleRowSelection", props.row.id);
};
</script>

<template>
  <div class="table-row">
    <div class="table-cell checkbox-cell">
      <input
        type="checkbox"
        :checked="selectedRows.includes(row.id)"
        @change="handleCheckboxChange"
      />
    </div>
    <TableCell
      v-for="column in columns"
      :key="column.key"
      :column="column"
      :row="row"
    />
  </div>
</template>

<style scoped lang="scss">
@import "@/shared/styles/_variables.scss";

$checkbox-col-width: 50px; // Ширина колонки для чекбокса

.table-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid $border-light;
  min-width: calc(
    900px + #{$checkbox-col-width}
  ); // Минимальная ширина для десктопа
  flex-wrap: nowrap; // Убеждаемся, что строки не переносятся на новую строку
  gap: 1px; // Добавляем промежуток между элементами

  &:nth-child(even) {
    background-color: $background-white;
  }
  &:nth-child(odd) {
    background-color: $background-lightest;
  }
  &:last-child {
    border-bottom: none;
  }

  @media (max-width: $breakpoint-tablet) {
    min-width: unset; // Сбрасываем минимальную ширину на мобильных
    flex-direction: column; // Каждая строка становится карточкой
    align-items: flex-start; // Выравнивание внутри карточки
    padding: 1rem; // Отступы для карточки
    margin-bottom: 1rem; // Отступ между карточками
    border: 1px solid $border-light; // Граница для каждой карточки
    border-radius: 0.5rem; // Закругленные углы для карточки
    background-color: $background-white; // Фон карточки
    position: relative; // Для правильного позиционирования чекбокса

    &:last-child {
      margin-bottom: 0; // Нет отступа у последней карточки
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
    z-index: 1; // Убеждаемся, что чекбокс находится поверх других элементов
    position: relative; // Необходимо для z-index
  }

  @media (max-width: $breakpoint-tablet) {
    flex: unset; // Сбрасываем flex
    width: 100%; // Занимаем всю ширину
    justify-content: flex-start; // Выравниваем чекбокс слева
    padding: 0.5rem 0; // Отступы
    border-bottom: none; // Убираем пунктирную линию для чекбокса в карточке
    margin-bottom: 0.5rem;
    min-height: 24px; // Увеличиваем минимальную высоту для лучшего касания
    align-items: center; // Выравниваем чекбокс по центру по вертикали
    position: absolute; // Позиционируем чекбокс абсолютно
    top: 0.75rem; // Сдвигаем чекбокс чуть выше
    left: 1rem; // Отступ слева
    width: auto; // Автоматическая ширина

    span {
      display: none; // Скрываем текст "Выбрать все" из этой ячейки на мобильном
    }

    input[type="checkbox"] {
      position: relative; // Делаем чекбокс относительным, чтобы z-index работал
      z-index: 1; // Чтобы чекбокс был над карточкой
    }
  }
}
</style>
