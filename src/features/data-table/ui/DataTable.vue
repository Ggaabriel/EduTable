<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { ColumnDef, SortingState } from "@tanstack/vue-table";
import {
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  useVueTable,
  FlexRender,
} from "@tanstack/vue-table";
import Filters from "@/entities/Filters.vue";

const props = defineProps<{
  columns: ColumnDef<any, unknown>[];
  data: any[];
  selectable?: boolean;
}>();

const emit = defineEmits<{
  (e: "update:selected", value: Set<string>): void;
}>();

// === Фильтры ===
const calendarRange = ref<[string, string] | null>(null);
const typeFilter = ref<string | null>(null);
const statusFilter = ref<string | null>(null);

// === Таблица ===
const sorting = ref<SortingState>([]);
const selectedIds = ref<Set<string>>(new Set());

// === Пагинация ===
const pageIndex = ref(0);
const pageSize = ref(10);
const pageSizeOptions = [10, 20, 30, 40, 50];
function goToPage(p: number) {
  pageIndex.value = p - 1;
  table.setPageIndex(pageIndex.value);
}
const table = useVueTable({
  get data() {
    return props.data;
  },
  get columns() {
    return props.columns;
  },
  state: {
    get sorting() {
      return sorting.value;
    },
    get pagination() {
      return { pageIndex: pageIndex.value, pageSize: pageSize.value };
    },
  },
  onSortingChange: (updater) => {
    sorting.value =
      typeof updater === "function" ? updater(sorting.value) : updater;
  },
  onPaginationChange: (updater) => {
    const next =
      typeof updater === "function"
        ? updater({ pageIndex: pageIndex.value, pageSize: pageSize.value })
        : updater;
    pageIndex.value = next.pageIndex;
    pageSize.value = next.pageSize;
  },
  getCoreRowModel: getCoreRowModel(),
  getSortedRowModel: getSortedRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
});

// === Выбор ===
watch(selectedIds, (v) => emit("update:selected", v));
const allSelected = computed(() => {
  if (!props.selectable || props.data.length === 0) return false;
  return props.data.some((r) => r.id && selectedIds.value.has(String(r.id)));
});
function toggleAll() {
  if (!props.selectable) return;
  if (allSelected.value) selectedIds.value = new Set();
  else {
    const next = new Set<string>();
    for (const r of props.data) if (r.id != null) next.add(String(r.id));
    selectedIds.value = next;
  }
}
function toggleOne(id?: string | number) {
  if (!props.selectable || id == null) return;
  const key = String(id);
  const next = new Set(selectedIds.value);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  selectedIds.value = next;
}

// === Страницы с "..."
const paginationPages = computed<(number | "...")[]>(() => {
  const totalPages = table.getPageCount();
  const current = pageIndex.value + 1;
  const pages: (number | "...")[] = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);

    if (current <= 3) {
      // первые три страницы
      pages.push(2, 3);
      pages.push("...");
    } else if (current >= totalPages - 2) {
      // последние три страницы
      pages.push("...");
      pages.push(totalPages - 2, totalPages - 1);
    } else {
      // середина
      pages.push("...", current - 1, current, current + 1, "...");
    }

    pages.push(totalPages);
  }

  return pages;
});
</script>

<template>
  <Filters
    :calendarRange="calendarRange"
    :typeFilter="typeFilter"
    :statusFilter="statusFilter"
    @update:calendarRange="(val: [string, string]) => (calendarRange = val)"
    @update:typeFilter="(val: string) => (typeFilter = val)"
    @update:statusFilter="(val: string) => (statusFilter = val)"
  />
  <div class="data-table__scroll">
    <div class="data-table">
      <!-- Header -->
      <div class="data-table__header">
        <div v-if="selectable" class="cell cell--checkbox">
          <label class="custom-checkbox">
            <input type="checkbox" :checked="allSelected" @change="toggleAll" />
            <span class="custom-checkbox__box">
              <svg
                v-if="allSelected"
                width="20"
                height="20"
                viewBox="0 0 20 20"
              >
                <rect
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  rx="4"
                  fill="#1B1B1F"
                />
                <path
                  d="M5 10H15"
                  stroke="#F1F4FD"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
              <svg v-else width="20" height="20" viewBox="0 0 20 20">
                <rect
                  x="0"
                  y="0"
                  width="20"
                  height="20"
                  rx="4"
                  fill="#1B1B1F"
                />
                <path
                  d="M5 10.5L9 14L15 7"
                  stroke="#F1F4FD"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </span>
          </label>
        </div>

        <template
          v-for="headerGroup in table.getHeaderGroups()"
          :key="headerGroup.id"
        >
          <template
            v-for="(header, index) in headerGroup.headers"
            :key="header.id"
          >
            <div
              class="cell cell--head"
              :class="{ 'cell--edu': index === headerGroup.headers.length - 1 }"
            >
              <button
                v-if="header.column.getCanSort()"
                class="head__btn"
                @click="header.column.toggleSorting()"
              >
                <span
                  ><FlexRender
                    :render="header.column.columnDef.header"
                    :props="header.getContext()"
                /></span>
                <span class="sort">
                  <i
                    class="sort__up"
                    :class="{ active: header.column.getIsSorted() === 'asc' }"
                  />
                  <i
                    class="sort__down"
                    :class="{ active: header.column.getIsSorted() === 'desc' }"
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
          </template>
        </template>
      </div>

      <!-- Body -->
      <div class="data-table__body">
        <template v-for="row in table.getRowModel().rows" :key="row.id">
          <div class="data-table__row">
            <div v-if="selectable" class="cell cell--checkbox">
              <label class="custom-checkbox">
                <input
                  type="checkbox"
                  :checked="
                    row.original.id != null &&
                    selectedIds.has(String(row.original.id))
                  "
                  @change="toggleOne(row.original.id as any)"
                />
                <span class="custom-checkbox__box">
                  <svg
                    v-if="
                      row.original.id != null &&
                      selectedIds.has(String(row.original.id))
                    "
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                  >
                    <rect
                      x="0"
                      y="0"
                      width="20"
                      height="20"
                      rx="4"
                      fill="#1B1B1F"
                    />
                    <path
                      d="M5 10.5L9 14L15 7"
                      stroke="#F1F4FD"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  <svg v-else width="20" height="20" viewBox="0 0 20 20">
                    <rect
                      x="0"
                      y="0"
                      width="20"
                      height="20"
                      rx="4"
                      fill="none"
                      stroke="#D3D3DE"
                      stroke-width="1.5"
                    />
                  </svg>
                </span>
              </label>
            </div>

            <template
              v-for="(cell, idx) in row.getVisibleCells()"
              :key="cell.id"
            >
              <div
                :class="{
                  'cell--edu': idx === row.getVisibleCells().length - 1,
                }"
              >
                <FlexRender
                  :render="cell.column.columnDef.cell"
                  :props="cell.getContext()"
                />
              </div>
            </template>
          </div>
          <div class="divider" />
        </template>
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <!-- Prev -->
        <div class="pagination__left">
          <button
            class="page-btn"
            :disabled="pageIndex === 0"
            @click="pageIndex--"
          >
            <svg
              width="9"
              height="14"
              viewBox="0 0 9 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 13L2 6.9947L8 1"
                stroke-width="1.5"
                stroke-miterlimit="10"
              />
            </svg>
          </button>

          <!-- Pages -->
          <div class="page-numbers">
            <button
              v-for="p in paginationPages"
              :key="p"
              class="page-number"
              :class="{ active: p === pageIndex + 1 }"
              @click="typeof p === 'number' && goToPage(p)"
              :disabled="p === '...'"
            >
              {{ p }}
            </button>
          </div>

          <!-- Next -->
          <button
            class="page-btn"
            :disabled="pageIndex === table.getPageCount() - 1"
            @click="pageIndex++"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M9 18L15 11.9947L9 6"
                stroke-width="1.5"
                stroke-miterlimit="10"
              />
            </svg>
          </button>
        </div>

        <!-- Rows per page -->
        <div class="rows-per-page">
          <span>Показывать</span>
          <select v-model.number="pageSize">
            <option v-for="opt in pageSizeOptions" :key="opt" :value="opt">
              {{ opt }}
            </option>
          </select>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@use "@/shared/styles/_variables.scss" as variables;

.pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 36px;
  gap: 24px;
  margin-top: 1.5rem;
}

.pagination__left {
  display: flex;
  align-items: center;
  max-width: 370px;
  justify-content: space-between;
  width: 100%;
  gap: 8px;
}

.page-btn {
  width: 44px;
  height: 36px;
  border: 1px solid #d3d3de;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  stroke: #55555c;
  transition:
    transform 0.2s ease,
    stroke 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  transform: translateX(-2px);
  stroke: #000;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 2px;
}

.page-number {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  color: #0e0e0f;
  cursor: pointer;
  background: transparent;
  transition:
    background 0.3s ease,
    transform 0.2s ease;
}

.page-number:hover:not(:disabled) {
  background: #f0f0f7;
}

.page-number.active {
  background: #f0f0f7;
  transition:
    transform 0.3s ease,
    background 0.3s ease;
}

.page-number:disabled {
  background: transparent;
  cursor: default;
}

.rows-per-page {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rows-per-page select {
  height: 36px;
  border-radius: 8px;
  border: 1px solid #d3d3de;
  padding: 0 8px;
  background: white;
  cursor: pointer;
}

.data-table__scroll {
  width: 100%;
  overflow-x: auto;
}

.data-table {
  min-width: 700px;
  width: 100%;
}

.data-table__header {
  display: grid;
  grid-template-columns: 2.25rem 1fr 1fr 1fr 0.6fr 1fr 1fr;
  align-items: center;
  gap: 0.625rem;
  background: variables.$background-light;
  min-height: 56px;
  padding: 0 1rem;
}

.data-table__body {
  display: flex;
  flex-direction: column;
}

.data-table__row {
  display: grid;
  grid-template-columns: 2.25rem 1fr 1fr 1fr 0.6fr 1fr 1fr;
  align-items: center;
  min-height: 63px;
  padding: 0 1rem;
  background: variables.$surface;
  gap: 0.625rem;
}

.cell {
  flex: 1 1 0;
  color: variables.$text;
}

.cell--head {
  color: #555c5c;
  font-weight: 500;
  display: flex;
  align-items: center;
}

.cell--head:last-child {
  flex: 0.5;
}

.cell--checkbox {
  flex: 0;
  width: 52px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 16px;
}

.head__btn {
  all: unset;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.sort {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  margin-right: 20px;
}

.sort__up,
.sort__down {
  width: 0;
  height: 0;
  border-left: 4px solid transparent;
  border-right: 4px solid transparent;
}

.sort__up {
  border-bottom: 8px solid variables.$muted;
}

.sort__up.active {
  border-bottom-color: variables.$active;
}

.sort__down {
  border-top: 8px solid variables.$muted;
}

.sort__down.active {
  border-top-color: variables.$active;
}

.divider {
  height: 1px;
  background: variables.$muted;
  opacity: 1;
}

.cell--edu {
  min-width: 120px;
  overflow-x: auto;
}

@media (max-width: variables.$breakpoint-tablet-lg) {
  .data-table__header,
  .data-table__row {
    grid-template-columns: 2rem 1fr 1fr 1fr minmax(120px, 0.7fr);
    gap: 0.5rem;
    padding: 0 0.5rem;
  }
}

@media (max-width: variables.$breakpoint-tablet) {
  .data-table__header {
    min-height: 64px;
  }
  .data-table__row {
    min-height: 68px;
  }
  .data-table__header,
  .data-table__row {
    grid-template-columns: 2rem 1fr 1fr 1fr minmax(120px, 1fr);
    gap: 0.25rem;
    padding: 0 0.25rem;
  }
  .cell--edu {
    min-width: 120px;
    max-width: 100vw;
    overflow-x: auto;
  }
}

.custom-checkbox {
  display: flex;
  align-items: center;
  cursor: pointer;
  user-select: none;
}

.custom-checkbox input[type="checkbox"] {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
  margin: 0;
  pointer-events: none;
}

.custom-checkbox__box {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 4px;
  transition: box-shadow 0.2s;
  box-sizing: border-box;
}

.custom-checkbox__box svg {
  display: block;
}

.custom-checkbox:hover .custom-checkbox__box {
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.15);
}
</style>
