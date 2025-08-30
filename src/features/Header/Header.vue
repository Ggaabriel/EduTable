<script setup lang="ts">
import styles from "./Header.module.scss";
import SearchInput from "@/features/search-input/ui/SearchInput.vue";
import DownloadBtn from "@/features/download-btn/ui/DownloadBtn.vue";

const { searchQuery } = defineProps<{
  searchQuery: string;
}>();
const emit = defineEmits(["update:searchQuery"]);

function onSearchChange(value: [string, string]) {
  emit("update:searchQuery", value);
}
</script>

<template>
  <header :class="styles.header">
    <h1 :class="styles.header__title">Таблица учреждений</h1>
    <div :class="styles.header__controls">
      <SearchInput :searchQuery="searchQuery" @update:searchQuery="onSearchChange"/>
      <DownloadBtn />
    </div>
  </header>
</template>
