import type { ColumnDef } from "@tanstack/vue-table";

type Institution = {
  id: string;
  name: string;
  region: string;
  address: string;
  educationLevels: string[];
};

export const columns: ColumnDef<Institution, unknown>[] = [
  {
    accessorKey: "region",
    header: "Регион",
    enableSorting: true,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "name",
    header: "Название",
    enableSorting: true,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "address",
    header: "Адрес",
    enableSorting: true,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "educationLevels",
    header: "Уровни образования",
    enableSorting: true,
    cell: ({ row }) => row.original.educationLevels.join(", "),
  },
  {
    accessorKey: "type",
    header: "Вид",
    enableSorting: true,
    cell: (info) => info.getValue(),
  },
  {
    accessorKey: "status",
    header: "Состояние",
    enableSorting: true,
    cell: (info) => info.getValue(),
  },
];
