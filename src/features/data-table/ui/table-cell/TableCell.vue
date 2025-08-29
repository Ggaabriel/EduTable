<script setup lang="ts">
import EducationLevelTag from "@/features/data-table/ui/education-level-tag/EducationLevelTag.vue";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
}

interface Row {
  id: string;
  [key: string]: unknown;
}

defineProps<{
  column: Column;
  row: Row;
}>();
</script>

<template>
  <div
    class="table-cell"
    :class="{
      'table-cell--name': column.key === 'name',
      'table-cell--city': column.key === 'city',
    }"
  >
    <template v-if="column.key === 'educationLevels'">
      <span class="cell-label">{{ column.label }}:</span>
      <div class="education-levels cell-value">
        <EducationLevelTag
          v-for="(level, index) in row.educationLevels as string[]"
          :key="index"
          :level="level"
        />
      </div>
    </template>
    <template v-else-if="column.key !== 'id'">
      <span class="cell-label">{{ column.label }}:</span>
      <span class="cell-value">{{ row[column.key] }}</span>
    </template>
  </div>
</template>

<style scoped lang="scss">
@import "@/shared/styles/_variables.scss";

.table-cell {
  flex: 1; // Равномерное распределение пространства
  min-width: 150px; // Минимальная ширина для предотвращения схлопывания
  padding: 0.75rem 1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: inherit; // Наследуем фон от родителя для чередования
  border-right: 1px solid $border-light; // Снова добавляем границу

  &:last-child {
    border-right: none; // Убираем границу у последнего элемента
  }

  @media (max-width: $breakpoint-tablet) {
    width: 100%; // Ячейки занимают всю ширину карточки
    padding: 0.5rem 0; // Уменьшаем отступы на мобильных
    font-size: 0.875rem; // Немного уменьшаем шрифт
    border-right: none; // Убираем вертикальные разделители
    justify-content: space-between; // Располагаем элементы по краям
    position: relative; // Для правильного позиционирования дочерних элементов
    border-bottom: 1px dashed $border-light; // Добавляем пунктирную линию между элементами карточки

    &:last-child {
      border-bottom: none; // Убираем пунктирную линию у последнего элемента в карточке
    }

    .cell-label {
      font-weight: 600; // Заголовок поля жирным
      margin-right: 0.5rem;
      flex-shrink: 0;
    }

    .cell-value {
      text-align: right; // Значение справа
      flex-grow: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.table-cell--name {
  @media (max-width: $breakpoint-tablet) {
    order: 1; // Название идет первым
  }
}

.table-cell--city {
  @media (max-width: $breakpoint-tablet) {
    order: 2; // Город идет вторым
  }
}

.education-levels {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: flex-end; // Выравниваем теги справа на мобильных

  @media (min-width: #{$breakpoint-tablet + 1}) {
    justify-content: flex-start; // На десктопе выравниваем слева
  }
}
</style>
