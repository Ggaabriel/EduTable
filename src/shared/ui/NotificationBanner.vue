<script setup lang="ts">
import { defineProps, defineEmits } from "vue";

defineProps({ message: String, visible: Boolean });
const emit = defineEmits<{
  (e: "retry"): void;
  (e: "close"): void;
}>();

function onRetryClick() {
  emit("retry");
}
</script>

<template>
  <transition name="slide-down">
    <div v-if="visible" class="notification-banner">
      <div class="message">{{ message }}</div>
      <div class="actions">
        <button class="btn retry" @click="onRetryClick">Повторить</button>
        <button class="btn close" @click="$emit('close')">Закрыть</button>
      </div>
    </div>
  </transition>
</template>

<style scoped>
.notification-banner {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 9999;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 14px 20px;
  background: #fff5f5;
  border-bottom: 2px solid #e53e3e;
  color: #742a2a;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.2s, color 0.2s;
}

.btn.retry {
  background: #e53e3e;
  color: white;
}
.btn.retry:hover {
  background: #c53030;
}

.btn.close {
  background: transparent;
  color: #742a2a;
  border: 1px solid #742a2a;
}
.btn.close:hover {
  background: #742a2a;
  color: white;
}

/* Анимация появления сверху */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
