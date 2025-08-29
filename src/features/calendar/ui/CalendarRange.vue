<script setup lang="ts">
import { ref, computed, watch } from "vue";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  format,
  isWithinInterval,
  parseISO,
} from "date-fns";
import { ru } from "date-fns/locale";

const emit = defineEmits(["update:modelValue", "onCancel"]);

const props = defineProps<{
  modelValue?: [string, string] | null;
}>();

const currentMonth = ref(new Date());

// Локальное состояние выбора диапазона
const localRangeStart = ref<Date | null>(
  props.modelValue?.[0] ? parseISO(props.modelValue[0]) : null,
);
const localRangeEnd = ref<Date | null>(
  props.modelValue?.[1] ? parseISO(props.modelValue[1]) : null,
);

watch(
  () => props.modelValue,
  (val) => {
    localRangeStart.value = val?.[0] ? parseISO(val[0]) : null;
    localRangeEnd.value = val?.[1] ? parseISO(val[1]) : null;
  },
);

function selectDay(day: Date) {
  if (
    !localRangeStart.value ||
    (localRangeStart.value && localRangeEnd.value)
  ) {
    localRangeStart.value = day;
    localRangeEnd.value = null;
  } else if (localRangeStart.value && !localRangeEnd.value) {
    if (day < localRangeStart.value) {
      localRangeEnd.value = localRangeStart.value;
      localRangeStart.value = day;
    } else {
      localRangeEnd.value = day;
    }
  }
}

function toApiFormat(date: Date | null) {
  return date ? format(date, "yyyy-MM-dd'T'HH:mm:ss.SSSSSS'Z'") : null;
}

function prevMonth() {
  currentMonth.value = subMonths(currentMonth.value, 1);
}
function nextMonth() {
  currentMonth.value = addMonths(currentMonth.value, 1);
}

const monthLabel = computed(() => {
  const label = format(currentMonth.value, "LLLL yyyy", { locale: ru });
  return label.charAt(0).toUpperCase() + label.slice(1);
});
const weeks = computed(() => {
  const start = startOfWeek(startOfMonth(currentMonth.value), {
    weekStartsOn: 1,
  });
  const end = endOfWeek(endOfMonth(currentMonth.value), { weekStartsOn: 1 });
  const days: Date[] = [];
  let day = start;
  while (day <= end) {
    days.push(day);
    day = addDays(day, 1);
  }
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
});

function isInRange(day: Date) {
  if (localRangeStart.value && localRangeEnd.value) {
    return isWithinInterval(day, {
      start: localRangeStart.value,
      end: localRangeEnd.value,
    });
  }
  return false;
}
function isSelected(day: Date) {
  return (
    (localRangeStart.value && isSameDay(day, localRangeStart.value)) ||
    (localRangeEnd.value && isSameDay(day, localRangeEnd.value))
  );
}

const weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function onCancel() {
  // Сбросить локальный выбор и уведомить родителя
  localRangeStart.value = props.modelValue?.[0]
    ? parseISO(props.modelValue[0])
    : null;
  localRangeEnd.value = props.modelValue?.[1]
    ? parseISO(props.modelValue[1])
    : null;
  emit("onCancel");
}
function onApply() {
  if (localRangeStart.value && localRangeEnd.value) {
    emit("update:modelValue", [
      toApiFormat(localRangeStart.value),
      toApiFormat(localRangeEnd.value),
    ]);
  }
}
</script>

<template>
  <div class="calendar-modal">
    <div class="calendar-header">
      <span class="calendar-title">Выбрать период</span>
      <div class="calendar-divider"></div>
      <div class="calendar-nav">
        <button
          class="calendar-arrow"
          @click="prevMonth"
          aria-label="Предыдущий месяц"
        >
          <svg
            width="9"
            height="14"
            viewBox="0 0 9 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 13L2 6.9947L8 1"
              stroke="#0E0E10"
              stroke-width="1.5"
              stroke-miterlimit="10"
            />
          </svg>
        </button>
        <span class="calendar-month">{{ monthLabel }}</span>
        <button
          class="calendar-arrow"
          @click="nextMonth"
          aria-label="Следующий месяц"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9 18L15 11.9947L9 6"
              stroke="#0E0E10"
              stroke-width="1.5"
              stroke-miterlimit="10"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="calendar-table">
      <div class="calendar-weekdays">
        <span
          v-for="d in weekDays"
          :key="d"
          class="calendar-weekday table-text"
          >{{ d }}</span
        >
      </div>
      <div v-for="(week, i) in weeks" :key="i" class="calendar-week">
        <button
          v-for="(day, j) in week"
          :key="day.toISOString()"
          class="calendar-day table-text"
          :class="{
            'calendar-day--selected': isSelected(day),
            'calendar-day--other': !isSameMonth(day, currentMonth),
            'calendar-day--inrange': isInRange(day),
            'calendar-day--range-start':
              isInRange(day) &&
              localRangeStart &&
              isSameDay(day, localRangeStart),
            'calendar-day--range-end':
              isInRange(day) && localRangeEnd && isSameDay(day, localRangeEnd),
            'calendar-day--first-in-week': j === 0,
            'calendar-day--last-in-week': j === week.length - 1,
          }"
          @click="selectDay(day)"
        >
          {{ day.getDate() }}
        </button>
      </div>
    </div>
    <div class="calendar-actions">
      <button
        class="calendar-btn calendar-btn--secondary section-title"
        @click="onCancel"
      >
        Отмена
      </button>
      <button
        class="calendar-btn calendar-btn--primary section-title"
        :disabled="!localRangeStart || !localRangeEnd"
        @click="onApply"
      >
        Сохранить
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
// ...минимальные стили для структуры, доработайте под свой дизайн...
.calendar-modal {
  background: #f1f4fd;
  border-radius: 16px;
  box-shadow: 0 5px 40px rgba(0, 0, 0, 0.1);
  width: 364px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
.calendar-header {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.calendar-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111827;
}
.calendar-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.calendar-arrow {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #222;
  padding: 0 8px;
}
.calendar-month {
  color: #111827;
  letter-spacing: 0.02em;
}
.calendar-divider {
  height: 0.0625rem;
  background: #d3d3de;
  margin: 1rem -1.5rem;
}
.calendar-table {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.calendar-weekdays {
  display: flex;
  gap: 13px;
}
.calendar-weekday {
  text-align: center;
  height: 2.125rem;
  width: 2.125rem;
  color: #9393a3;
  font-size: 0.95rem;
  font-weight: 500;
  padding: 4px 0;
}
.calendar-week {
  display: flex;
  gap: 13px;
}

.calendar-day {
  height: 2.125rem;
  width: 2.125rem;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1rem;
  color: #222;
  transition: background 0.15s;
  position: relative;
  z-index: 1;

  &--other {
    color: #d3d3de;
    cursor: default;
  }
  &--selected {
    background: #33d35e !important;
    z-index: 2;
    position: relative;
  }
  &--inrange {
    background: #c3f7d6;
    color: #222;
    z-index: 1;
    position: relative;
    &::before,
    &::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      width: 13px;
      background: #c3f7d6;
      z-index: 0;
      pointer-events: none;
      display: block;
    }
    &::before {
      left: -13px;
    }
    &::after {
      right: -13px;
    }
  }
  // Для первого выбранного дня (range start) — только after, цвет как selected
  &--range-start {
    &::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      right: -13px;
      width: 13px;
      background: #c3f7d6;
      z-index: 2;
      pointer-events: none;
      display: none;
    }
    &.calendar-day--inrange::after {
      display: block;
    }
    &::before {
      display: none;
    }
  }
  // Для последнего выбранного дня (range end) — только before, цвет как selected
  &--range-end {
    &::before {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: -13px;
      width: 13px;
      background: #c3f7d6;
      z-index: 2;
      pointer-events: none;
      display: none;
    }
    &.calendar-day--inrange::before {
      display: block;
    }
    &::after {
      display: none;
    }
  }
}
.calendar-footer {
  margin-top: 8px;
  font-size: 0.95rem;
  color: #222;
  display: flex;
  gap: 8px;
}
.calendar-actions {
  display: flex;
  gap: 20px;
  margin-top: 8px;
}
.calendar-btn {
  flex: 1 1 0;
  height: 53px;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s,
    border 0.15s;
  border: none;
  outline: none;
  &--secondary {
    background: #fff;
    color: #0e0e10;
    border: 1px solid #55565c;
  }
  &--primary {
    background: #0e0e10;
    color: #f1f4fd;
    border: none;
  }
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}

/* Убираем before для первого дня недели и after для последнего дня недели */
.calendar-day--inrange.calendar-day--first-in-week::before {
  display: none;
}
.calendar-day--inrange.calendar-day--last-in-week::after {
  display: none;
}
</style>
