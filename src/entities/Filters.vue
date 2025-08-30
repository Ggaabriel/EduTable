<script lang="ts" setup>
import CalendarFilter from "@/features/calendar/ui/CalendarFilter.vue";
import styles from "./Filters.module.scss";
import SelectInput from "@/shared/ui/SelectInput.vue";
import { onMounted, onUpdated } from "vue";

interface IProps {
  calendarRange: [string, string] | null;
  typeFilter: string | null;
  statusFilter: string | null;
}

const { calendarRange, statusFilter, typeFilter } = defineProps<IProps>();
onMounted(() => {
  console.log("Mounted");
});

onUpdated(() => {
  console.log("Updated (rerender)");
});
const emit = defineEmits([
  "update:calendarRange",
  "update:typeFilter",
  "update:statusFilter",
]);

function onCalendarChange(value: [string, string]) {
  emit("update:calendarRange", value);
}

function onTypeChange(value: string) {
  emit("update:typeFilter", value);
}

function onStatusChange(value: string) {
  emit("update:statusFilter", value);
}
const typeOptions = [
  { value: "academy", label: "Академия" },
  { value: "university", label: "ВУЗ" },
  { value: "school", label: "Школа" },
];

const statusOptions = [
  { value: "active", label: "Действующее" },
  { value: "inactive", label: "Недействующее" },
  { value: "unknown", label: "Неизвестно" },
];
</script>

<template>
  <div :class="styles.filters">
    <CalendarFilter
      :modelValue="calendarRange"
      @update:modelValue="onCalendarChange"
    />
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
    
  </div>
</template>
