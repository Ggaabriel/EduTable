<script setup lang="ts">
import Save from "@/app/images/Save.svg";
import TableButton from "./TableButton.vue";
const { downloadFromUrl } = defineProps<{
  downloadFromUrl: () => void;
}>();
</script>

<template>
  <TableButton :func="downloadFromUrl" modelValue="Скачать">
    <Save alt="Скачать" class="table-btn__icon" />
  </TableButton>
</template>
