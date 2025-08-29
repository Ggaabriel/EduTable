<script setup lang="ts">
defineProps<{
  level: string;
}>();
</script>

<template>
  <span class="education-level-tag">{{ level }}</span>
</template>

<style scoped lang="scss">
@import "@/shared/styles/_variables.scss";

.education-level-tag {
  background-color: $primary-light; // Цвет кругляшка
  color: $primary-dark; // Цвет текста
  padding: 0.25rem 0.75rem;
  border-radius: 1rem;
  font-size: 0.75rem;
  font-weight: 500;

  @media (max-width: $breakpoint-tablet) {
    padding: 0.2rem 0.6rem; // Уменьшаем отступы на мобильных
    font-size: 0.65rem; // Уменьшаем шрифт
  }
}
</style>
