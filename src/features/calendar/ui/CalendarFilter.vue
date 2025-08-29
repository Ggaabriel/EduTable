<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import { format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import CalendarRange from "./CalendarRange.vue";

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

function open() {
  tempRange.value = getCurrentRange();
  show.value = true;
}
function close() {
  show.value = false;
  tempRange.value = getCurrentRange();
}
function onApply(val: [string, string]) {
  emit("update:modelValue", val);
  show.value = false;
}
function onCancel() {
  emit("update:modelValue", null); // сбрасываем выбранный диапазон
  show.value = false;
  tempRange.value = getCurrentRange();
}

// Закрытие по клику вне
function handleClickOutside(e: MouseEvent) {
  if (!show.value) return;
  const filter = document.getElementById("calendar-filter-root");
  if (filter && !filter.contains(e.target as Node)) {
    close();
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
    <button class="calendar-filter-btn" @click="open">
      <span class="calendar-filter-label">
        {{ formatRangeLabel(getCurrentRange()) }}
      </span>
      <svg
        class="calendar-filter-icon"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
      >
        <rect
          x="3"
          y="4"
          width="18"
          height="16"
          rx="2"
          stroke="#55565C"
          stroke-width="1.5"
        />
        <path
          d="M16 2V6"
          stroke="#55565C"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M8 2V6"
          stroke="#55565C"
          stroke-width="1.5"
          stroke-linecap="round"
        />
        <path
          d="M3 10H21"
          stroke="#55565C"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
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
  position: relative;
  display: inline-block;
  width: 320px;
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
