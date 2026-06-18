import React from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Column } from "@tanstack/react-table";

interface SortableHeaderProps<TData> {
  column: Column<TData, unknown>;
  children: React.ReactNode;
  className?: string;
}

export function SortableHeader<TData>({
  column,
  children,
  className,
}: SortableHeaderProps<TData>) {
  const sortDirection = column.getIsSorted();

  return (
    <div
      className={cn(
        "flex items-center gap-1 cursor-pointer select-none hover:text-foreground transition-colors",
        className
      )}
      onClick={column.getToggleSortingHandler()}
    >
      <span>{children}</span>
      {sortDirection === "asc" && (
        <ArrowUp size={14} className="text-primary" />
      )}
      {sortDirection === "desc" && (
        <ArrowDown size={14} className="text-primary" />
      )}
      {!sortDirection && (
        <ArrowUpDown size={14} className="text-muted-foreground/60" />
      )}
    </div>
  );
}
