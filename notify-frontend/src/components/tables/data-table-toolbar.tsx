// components/ui/data-table-toolbar.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import type { Table } from "@tanstack/react-table";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
  searchPlaceholder?: string;
}

export function DataTableToolbar<TData>({
  globalFilter,
  setGlobalFilter,
  searchPlaceholder = "Buscar...",
}: DataTableToolbarProps<TData>) {
  const isFiltered = globalFilter.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder={searchPlaceholder}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          className="h-8 w-[150px] lg:w-[350px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => setGlobalFilter("")}
            className="h-8 px-2 lg:px-3"
          >
            Limpar
            <X className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
