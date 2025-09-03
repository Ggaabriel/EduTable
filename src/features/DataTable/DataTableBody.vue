<script setup lang="ts">
import type { Row } from "@tanstack/vue-table";
import { FlexRender } from "@tanstack/vue-table";
import styles from "./DataTable.module.scss";
import type { School } from "@/app/App.vue";
import CheckboxEmpty from "@/app/images/CheckboxEmpty.svg";
import CheckboxChecked from "@/app/images/CheckboxChecked.svg";
import { Skeleton } from "primevue";

interface Props {
  isLoading: boolean;
  rows: Row<School>[];
  selectedIds: Set<string>;
  selectable?: boolean;
  toggleOne: (id?: string | number) => void;
}

const {isLoading, rows, selectable, selectedIds, toggleOne} = defineProps<Props>();
console.log(isLoading);
</script>

<template>
  <!-- если загрузка, рисуем скелетоны -->
  <template v-if="isLoading">
    <tr v-for="i in 10" :key="'skeleton-' + i" :class="styles.dataTableRow">
      <td v-for="j in 6" :key="j">
        <Skeleton height="20px" width="100%" borderRadius="6px" />
      </td>
    </tr>
  </template>

  <!-- иначе обычные строки -->
  <template v-else>
    <template v-for="row in rows" :key="row.id">
      <tr :class="styles.dataTableRow">
        <template v-for="(cell, idx) in row.getVisibleCells()" :key="cell.id">
          <td>
            <div :class="{ [styles.cellEdu]: idx === 0 }">
              <div
                v-if="selectable && idx === 0"
                :class="[styles.cell, styles.cellCheckbox]"
              >
                <label :class="styles.customCheckbox">
                  <input
                    type="checkbox"
                    :checked="
                      row.original.id != null &&
                      selectedIds.has(String(row.original.id))
                    "
                    @change="() => toggleOne(row.original.id)"
                  />
                  <span :class="styles.customCheckboxBox">
                    <CheckboxChecked
                      v-if="
                        row.original.id != null &&
                        selectedIds.has(String(row.original.id))
                      "
                    />
                    <CheckboxEmpty v-else />
                  </span>
                </label>
              </div>
              <div>
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </div>
            </div>
          </td>
        </template>
      </tr>
    </template>
  </template>
</template>
