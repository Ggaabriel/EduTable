<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from "vue";
import SelectSkeleton from "./SelectSkeleton.vue";

interface Option {
  value: string | number;
  label: string;
}

interface OptionGroup {
  label: string;
  options: Option[];
}

type PropsOptions = Option[] | OptionGroup[];

const props = defineProps<{
  modelValue?: number | string | null;
  options: PropsOptions;
  placeholder?: string;
  isPending?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const showDropdown = ref(false);
const selectedLabel = ref(
  findLabelByValue(props.modelValue) || props.placeholder || "Выберите",
);

watch(
  () => props.modelValue,
  (newValue) => {
    selectedLabel.value =
      findLabelByValue(newValue) || props.placeholder || "Выберите";
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

function isGroup(option: Option | OptionGroup): option is OptionGroup {
  return (option as OptionGroup).options !== undefined;
}

function findLabelByValue(value: unknown): string | null {
  if (!value) return null;

  if (props.options.length === 0) return null;

  if (isGroup(props.options[0] as Option | OptionGroup)) {
    // групповой селект
    for (const group of props.options as OptionGroup[]) {
      const found = group.options.find((opt) => opt.value === value);
      if (found) return found.label;
    }
  } else {
    // обычный селект
    const found = (props.options as Option[]).find(
      (opt) => opt.value === value,
    );
    if (found) return found.label;
  }

  return null;
}
</script>

<template>
  <SelectSkeleton v-if="isPending" />
  <div v-else class="select-input">
    <button class="select-input__button" @click="toggleDropdown">
      <span class="select-input__label">
        {{ selectedLabel }}
      </span>
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
        <template
          v-for="option in options"
          :key="isGroup(option) ? option.label : option.value"
        >
          <template v-if="isGroup(option)">
            <li class="select-input__group-label">{{ option.label }}</li>
            <li
              v-for="opt in option.options"
              :key="opt.value"
              @click="selectOption(opt)"
              class="select-input__list-item"
              :class="{
                'select-input__list-item--selected': modelValue === opt.value,
              }"
            >
              {{ opt.label }}
            </li>
          </template>
          <template v-else>
            <li
              @click="selectOption(option)"
              class="select-input__list-item"
              :class="{
                'select-input__list-item--selected':
                  modelValue === option.value,
              }"
            >
              {{ option.label }}
            </li>
          </template>
        </template>
      </ul>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/shared/styles/_variables.scss" as *;

.select-input {
  flex-grow: 1;
  position: relative;

  &__button {
    width: 100%;
    height: 56px;
    border-radius: $radius;
    border: 1px solid $muted;
    background: $surface;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    font-size: 1.1rem;
    color: $text;
    cursor: pointer;
    transition: border 0.15s;

    &:hover,
    &:focus {
      border-color: $primary;
    }
  }

  &__label {
    flex: 1;
    text-align: left;
  }

  &__icon {
    margin-left: 16px;
    transition: transform 0.2s ease-in-out;

    &--open {
      transform: rotate(180deg);
    }
  }

  &__dropdown {
    position: absolute;
    top: 62px;
    left: 0;
    width: 100%;
    background-color: $surface;
    border-radius: $radius;
    box-shadow: $shadow;
    z-index: 1000;
    overflow: hidden;
  }

  &__list {
    list-style: none;
    margin: 0;
    padding: 0;
    max-height: 200px;
    overflow-y: auto;
  }

  &__group-label {
    font-weight: bold;
    padding: 8px 12px;
    background: $background-light;
    color: $active;
  }

  &__list-item {
    padding: 12px 24px;
    cursor: pointer;
    transition: background-color 0.15s;
    font-size: 1.1rem;
    color: $text;

    &:hover {
      background-color: $background-light;
    }

    &--selected {
      background-color: $primary;
      font-weight: 600;
    }
  }
}
</style>
