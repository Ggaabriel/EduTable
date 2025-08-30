<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import CalendarRange from "./CalendarRange.vue";
import Calendar from "@/app/images/Calendar.svg";

const props = defineProps<{
  modelValue?: [string, string] | null;
}>();
const emit = defineEmits(["update:modelValue"]);

function getCurrentRange(): [string, string] | null {
  return props.modelValue ?? null;
}

const show = ref(false);
const tempRange = ref<[string, string] | null>(getCurrentRange());

watch(
  () => props.modelValue,
  (val) => {
    if (!show.value) tempRange.value = val ?? null;
  },
);

function toggleCalendar() {
  tempRange.value = getCurrentRange();
  show.value = !show.value;
}
function onApply(val: [string, string]) {
  emit("update:modelValue", val);
  show.value = false;
}
function onCancel() {
  emit("update:modelValue", null);
  show.value = false;
  tempRange.value = getCurrentRange();
}

function handleClickOutside(e: MouseEvent) {
  if (!show.value) return;
  const filter = document.getElementById("calendar-filter-root");
  if (filter && !filter.contains(e.target as Node)) {
    toggleCalendar();
  }
}
onMounted(() => {
  document.addEventListener("mousedown", handleClickOutside);
});
onBeforeUnmount(() => {
  document.removeEventListener("mousedown", handleClickOutside);
});

function formatRangeLabel(range: [string, string] | null) {
  if (!range || !range[0] || !range[1]) return "Действие лицензии";
  const start = parseISO(range[0]);
  const end = parseISO(range[1]);
  return `${format(start, "dd MMMM yyyy", { locale: ru })} - ${format(end, "dd MMMM yyyy", { locale: ru })}`;
}
</script>

<template>
  <div class="calendar-filter" id="calendar-filter-root">
    <button class="calendar-filter-btn" @click="toggleCalendar">
      <span class="calendar-filter-label">
        {{ formatRangeLabel(getCurrentRange()) }}
      </span>
      <Calendar class="calendar-filter-icon" />
    </button>
    <div v-if="show" class="calendar-filter-popup">
      <CalendarRange
        v-model="tempRange"
        @update:modelValue="onApply"
        @onCancel="onCancel"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
.calendar-filter {
  flex-grow: 1;
  position: relative;
  display: block;
}
.calendar-filter-btn {
  width: 100%;
  height: 56px;
  border-radius: 10px;
  border: 1px solid #d3d3de;
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
  font-size: 1.1rem;
  color: #0e0e10;
  cursor: pointer;
  transition: border 0.15s;
  &:hover,
  &:focus {
    border-color: #33d35e;
  }
}
.calendar-filter-label {
  flex: 1;
  text-align: left;
}
.calendar-filter-icon {
  margin-left: 16px;
}
.calendar-filter-popup {
  position: absolute;
  top: 62px;
  left: 0;
  z-index: 100;
}
</style>
