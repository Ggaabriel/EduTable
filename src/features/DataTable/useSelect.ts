import type { School } from "@/app/App.vue";
import { computed, ref, watch } from "vue";

type Props = {
  emit: { (e: "update:selected", value: Set<string>): void };
  selectable?: boolean;
  schools: School[];
};

export const useSelect = ({
  emit,
  selectable,
  schools,
}: Props) => {
  const selectedIds = ref<Set<string>>(new Set());

  watch(selectedIds, (v) => emit("update:selected", v));
  const allSelected = computed(() => {
    if (!selectable || schools.length === 0) return false;
    return schools.some((r) => r.id && selectedIds.value.has(String(r.id)));
  });
  function toggleAll() {
    if (!selectable) return;
    if (allSelected.value) selectedIds.value = new Set();
    else {
      const next = new Set<string>();
      for (const r of schools) if (r.id != null) next.add(String(r.id));
      selectedIds.value = next;
    }
  }
  function toggleOne(id?: string | number) {
    if (!selectable || id == null) return;
    const key = String(id);
    const next = new Set(selectedIds.value);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    selectedIds.value = next;
  }
  return { allSelected, toggleAll, toggleOne, selectedIds };
};
