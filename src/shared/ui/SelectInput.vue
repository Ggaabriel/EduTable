<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";

interface Option {
  value: string;
  label: string;
}

const props = defineProps<{
  modelValue?: string | null;
  options: Option[];
  placeholder?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const showDropdown = ref(false);
const selectedLabel = ref(
  props.options.find((opt) => opt.value === props.modelValue)?.label ||
    props.placeholder ||
    "Выберите",
);

watch(
  () => props.modelValue,
  (newValue) => {
    selectedLabel.value =
      props.options.find((opt) => opt.value === newValue)?.label ||
      props.placeholder ||
      "Выберите";
  },
);

function toggleDropdown() {
  showDropdown.value = !showDropdown.value;
}

function selectOption(option: Option) {
  emit("update:modelValue", option.value);
  selectedLabel.value = option.label;
  showDropdown.value = false;
}

function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement;
  if (
    showDropdown.value &&
    !target.closest(".select-input")?.contains(target)
  ) {
    showDropdown.value = false;
  }
}

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<template>
  <div class="select-input">
    <button class="select-input__button" @click="toggleDropdown">
      <span class="select-input__label">{{ selectedLabel }}</span>
      <svg
        class="select-input__icon"
        :class="{ 'select-input__icon--open': showDropdown }"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 9L12 15L18 9"
          stroke="#55565C"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
    </button>
    <div v-if="showDropdown" class="select-input__dropdown">
      <ul class="select-input__list">
        <li
          v-for="option in options"
          :key="option.value"
          @click="selectOption(option)"
          class="select-input__list-item"
          :class="{
            'select-input__list-item--selected': modelValue === option.value,
          }"
        >
          {{ option.label }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/shared/styles/_variables.scss";

.select-input {
  position: relative;
  width: 320px;
}

.select-input__button {
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

.select-input__label {
  flex: 1;
  text-align: left;
}

.select-input__icon {
  margin-left: 16px;
  transition: transform 0.2s ease-in-out;

  &--open {
    transform: rotate(180deg);
  }
}

.select-input__dropdown {
  position: absolute;
  top: 62px;
  left: 0;
  width: 100%;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
}

.select-input__list {
  list-style: none;
  margin: 0;
  padding: 0;
  max-height: 200px; /* Ограничить высоту для скроллинга */
  overflow-y: auto;
}

.select-input__list-item {
  padding: 12px 24px;
  cursor: pointer;
  transition: background-color 0.15s;
  font-size: 1.1rem;
  color: #0e0e10;

  &:hover {
    background-color: #f0f0f0;
  }

  &--selected {
    background-color: #e6ffe6;
    font-weight: 600;
  }
}
</style>
