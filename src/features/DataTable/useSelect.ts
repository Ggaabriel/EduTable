import type { School } from "@/app/App.vue";
import { computed, type Ref } from "vue";

type Props = {
  selectable?: Ref<boolean, boolean>;
  schools: Ref<School[]>;
  selectedIds: Ref<Set<string>>;
};

export const useSelect = ({ selectable, schools, selectedIds }: Props) => {

  const allSelected = computed(() => {
    if (!selectable || schools.value.length === 0) return false;
    return schools.value.some(
      (r) => r.id && selectedIds.value.has(String(r.id)),
    );
  });
  function toggleAll() {
    if (!selectable) return;
    if (allSelected.value) selectedIds.value = new Set();
    else {
      const next = new Set<string>();
      for (const r of schools.value) if (r.id != null) next.add(String(r.id));
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
  return { allSelected, toggleAll, toggleOne };
};
