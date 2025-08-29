<script setup lang="ts">
import { ref, defineEmits } from "vue";
import SearchIcon from "@/shared/styles/icons/SearchIcon.vue";

const props = defineProps<{
  modelValue?: string;
}>();
const emit = defineEmits(["update:modelValue"]);

const isActive = ref(false);

function onFocus() {
  isActive.value = true;
}
function onBlur() {
  isActive.value = false;
}
function onInput(e: Event) {
  emit("update:modelValue", (e.target as HTMLInputElement).value);
}
</script>

<template>
  <div class="search-input" :class="{ 'search-input--active': isActive }">
    <input
      type="text"
      :value="props.modelValue"
      @input="onInput"
      @focus="onFocus"
      @blur="onBlur"
      placeholder="Поиск..."
      class="search-input__field"
    />
    <SearchIcon class="search-input__icon" />
  </div>
</template>

<style lang="scss" scoped>
@import "@/shared/styles/_variables.scss";

.search-input {
  position: relative;
  display: flex;
  align-items: center;
  border: 1px solid $muted;
  border-radius: 0.625rem;
  background: white;
  transition: all 0.2s ease;

  // По умолчанию иконка серая
  .search-input__icon {
    stroke: $muted;
    transition: stroke 0.2s;
  }

  // При hover или focus-within — чёрная
  &:hover .search-input__icon,
  &:focus-within .search-input__icon {
    stroke: #0e0e10;
  }

  &:focus-within {
    border-color: #33d35e;
    box-shadow: 0 0 0 3px rgba(51, 211, 94, 0.1);
    background: white;
  }
}

.search-input__field {
  width: clamp(200px, 20vw, 300px);
  height: 3.5rem;
  padding: 0 1rem 0 1.5rem;
  border: none;
  outline: none;
  background: transparent;
  font-family: $font-family;
  font-size: 1rem;
  color: $text;
  transition: all 0.2s ease;

  &::placeholder {
    color: $muted;
    transition: color 0.2s ease;
  }
}

.search-input__icon {
  width: 1.5rem;
  height: 1.5rem;
  margin-right: 1rem;
  flex-shrink: 0;
}

/* --- Адаптивность --- */
@media (max-width: 768px) {
  .search-input__field {
    width: 100%;
    min-width: 250px;
  }
}

@media (max-width: 480px) {
  .search-input__field {
    min-width: auto;
  }
}
</style>
