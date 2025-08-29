<script setup lang="ts">
</script>

<template>
  <button class="download-btn">
    <img src="@/app/images/Save.svg" alt="Скачать" class="download-btn__icon" />
    <span class="download-btn__text">Скачать</span>
  </button>
</template>

<style lang="scss" scoped>
.download-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 3.5rem;
  padding: 0 1.5rem;
  background: #33d35e;
  border: none;
  border-radius: 0.625rem;
  color: #0e0e10;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.2s,
    transform 0.2s;
  white-space: nowrap;

  &:hover {
    background: #24c14e;
  }

  &:active {
    background: #16b240;
  }
}

.download-btn__icon {
  width: 1.5rem;
  height: 1.5rem;
  flex-shrink: 0;
}

.download-btn__text {
  font-weight: 500;
  color: #0e0e10;
}
</style>
