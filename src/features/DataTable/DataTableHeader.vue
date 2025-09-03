<script setup lang="ts">
import { FlexRender, type HeaderGroup } from "@tanstack/vue-table";
import styles from "./DataTable.module.scss";
import type { School } from "@/app/App.vue";
import CheckboxEmpty from "@/app/images/CheckboxEmpty.svg";
import CheckboxChecked from "@/app/images/CheckboxChecked.svg";

const { headerGroups, allSelected, toggleAll } = defineProps<{
  headerGroups: HeaderGroup<School>[];
  allSelected: boolean;
  toggleAll: () => void;
}>();
</script>

<template>
  <tr :class="styles.dataTableHeader">
    <template v-for="headerGroup in headerGroups" :key="headerGroup.id">
      <template v-for="(header, index) in headerGroup.headers" :key="header.id">
        <th scope="col" :class="[styles.cell]">
          <div :class="styles.cell__content">
            <div v-if="index === 0" :class="[styles.cell, styles.cellCheckbox]">
              <label :class="styles.customCheckbox">
                <input
                  type="checkbox"
                  :checked="allSelected"
                  @change="toggleAll"
                />
                <span :class="styles.customCheckboxBox">
                  <CheckboxChecked v-if="allSelected" />
                  <CheckboxEmpty v-else />
                </span>
              </label>
            </div>
            <button
              v-if="header.column.getCanSort()"
              :class="styles.headBtn"
              @click="header.column.toggleSorting()"
            >
              <FlexRender
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
              <span :class="styles.sort">
                <i
                  :class="[
                    styles.sortUp,
                    {
                      [styles.active]: header.column.getIsSorted() === 'asc',
                    },
                  ]"
                />
                <i
                  :class="[
                    styles.sortDown,
                    {
                      [styles.active]: header.column.getIsSorted() === 'desc',
                    },
                  ]"
                />
              </span>
            </button>
            <span v-else>
              <FlexRender
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </span>
          </div>
        </th>
      </template>
    </template>
  </tr>
</template>
