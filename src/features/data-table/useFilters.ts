import { ref } from "vue";

export function useFilters() {
  const calendarRange = ref<[string, string] | null>(null);
  const typeFilter = ref<string | null>(null);
  const statusFilter = ref<string | null>(null);

  return {
    calendarRange,
    typeFilter,
    statusFilter,
  };
}
