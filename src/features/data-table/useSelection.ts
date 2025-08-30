import { ref, computed, watch } from "vue";

export function useSelection(props: { data: any[]; selectable?: boolean }, emit: any) {
  const selectedIds = ref<Set<string>>(new Set());

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

  return {
    selectedIds,
    allSelected,
    toggleAll,
    toggleOne,
  };
}
