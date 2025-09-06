<script lang="ts" setup>
// import CalendarFilter from "@/features/calendar/ui/CalendarFilter.vue";
import SelectInput from "@/shared/ui/SelectInput.vue";
import styles from "./Filters.module.scss";
import TableButton from "@/features/download-btn/ui/TableButton.vue";

interface Option {
  value: string | number;
  label: string;
}

interface OptionGroup {
  label: string;
  options: Option[];
}

interface IProps {
  calendarRange: [string, string] | null;
  typeFilter: string | null;
  statusFilter: string | null;
  regionFilter: string | null;
  typeOptions: Option[];
  statusOptions: Option[];
  regionOptions: OptionGroup[];
  isPending: boolean;
  killFilters: () => void;
}

const {
  killFilters,
  isPending,
  // calendarRange,
  statusFilter,
  typeFilter,
  regionFilter,
  typeOptions,
  statusOptions,
  regionOptions,
} = defineProps<IProps>();

const emit = defineEmits([
  "update:calendarRange",
  "update:typeFilter",
  "update:statusFilter",
  "update:regionFilter",
]);

// function onCalendarChange(value: [string, string]) {
//   emit("update:calendarRange", value);
// }

function onTypeChange(value: string) {
  emit("update:typeFilter", value);
}

function onStatusChange(value: string) {
  emit("update:statusFilter", value);
}

function onRegionChange(value: string) {
  emit("update:regionFilter", value);
}
</script>

<template>
  <div :class="styles.filters">
    <SelectInput
      :modelValue="regionFilter"
      @update:modelValue="onRegionChange"
      :options="regionOptions"
      placeholder="Федеральные округа и регионы"
      :isPending="isPending"
    />
    <!-- <CalendarFilter
      :modelValue="calendarRange"
      @update:modelValue="onCalendarChange"
    /> -->
    <SelectInput
      :modelValue="typeFilter"
      @update:modelValue="onTypeChange"
      :options="typeOptions"
      placeholder="Вид"
    />
    <SelectInput
      :modelValue="statusFilter"
      @update:modelValue="onStatusChange"
      :options="statusOptions"
      placeholder="Состояние"
    />
    <TableButton :func="killFilters" modelValue="Сбросить фильтры"/>
  </div>
</template>
