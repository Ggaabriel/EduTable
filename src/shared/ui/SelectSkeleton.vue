<template>
  <div class="select-skeleton">
    <div class="select-skeleton__bar" />
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@use "@/shared/styles/_variables.scss" as *;

.select-skeleton {
  width: 100%;
  height: 56px;
  border-radius: $radius;
  background: $background-lightest;
  overflow: hidden;
  position: relative;

  &__bar {
    width: 40%;
    height: 100%;
    background: linear-gradient(
      90deg,
      $background-lightest 0%,
      $background-light 50%,
      $background-lightest 100%
    );
    animation: skeleton-loading 1.2s infinite;
  }
}

@keyframes skeleton-loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}
</style>
