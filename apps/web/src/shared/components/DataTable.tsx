import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";
import { ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "./ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"; // shadcn table

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pagination?: PaginationState;
  pageCount?: number;
  onPaginationChange?: (pagination: PaginationState) => void;
  sorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  data,
  columns,
  pagination,
  pageCount,
  onPaginationChange,
  sorting,
  onSortingChange,
  isLoading,
  onRowClick,
}: DataTableProps<T>) {
  const effectivePagination = pagination ?? {
    pageIndex: 0,
    pageSize: data.length || 10,
  };
  const effectivePageCount = pageCount ?? 1;
  const table = useReactTable({
    data,
    columns,
    state: { pagination: effectivePagination, sorting },
    pageCount: effectivePageCount,
    manualPagination: !!pagination,
    manualSorting: true,
    onPaginationChange: (updater) => {
      const newPagination =
        typeof updater === "function" ? updater(effectivePagination) : updater;
      onPaginationChange?.(newPagination);
    },
    onSortingChange: (updater) => {
      const newSorting =
        typeof updater === "function" ? updater(sorting!) : updater;
      onSortingChange?.(newSorting);
    },
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="overflow-x-auto rounded-xl border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead
                  key={header.id}
                  className="cursor-pointer select-none"
                  onClick={header.column.getToggleSortingHandler()}
                >
                  <div className="flex items-center gap-2">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}

                    {{
                      asc: <ArrowUp size={14} />,

                      desc: <ArrowDown size={14} />,
                    }[header.column.getIsSorted() as string] ?? null}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-slate-500"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                className={onRowClick ? "cursor-pointer" : undefined}
                onClick={onRowClick ? () => onRowClick(row.original) : undefined}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-32 text-center text-slate-500"
              >
                {" "}
                No data found{" "}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        {/* Pagination controls can be added outside */}
      </Table>

      <div className="mt-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        {/* LEFT */}

        <div className="flex items-center gap-3">
          <p className="text-sm text-slate-500">
            Page{" "}
            <span className="font-medium text-black">
              {effectivePagination.pageIndex + 1}
            </span>{" "}
            of{" "}
            <span className="font-medium text-black">
              {effectivePageCount || 1}
            </span>
          </p>

          {pagination && onPaginationChange ? (
            <select
              value={pagination.pageSize}
              onChange={(e) =>
                onPaginationChange({
                  ...pagination,
                  pageSize: Number(e.target.value),
                  pageIndex: 0,
                })
              }
              className="rounded-lg border px-2 py-1 text-sm"
            >
              <option value={10}>10 rows</option>
              <option value={25}>25 rows</option>
              <option value={50}>50 rows</option>
              <option value={100}>100 rows</option>
            </select>
          ) : null}
        </div>

        {/* RIGHT */}

        {pagination && onPaginationChange ? (
          <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={effectivePagination.pageIndex === 0}
            onClick={() =>
              onPaginationChange({
                ...effectivePagination,
                pageIndex: effectivePagination.pageIndex - 1,
              })
            }
          >
            Previous
          </Button>

          <Button
            variant="outline"
            size="sm"
            disabled={effectivePagination.pageIndex + 1 >= effectivePageCount}
            onClick={() =>
              onPaginationChange({
                ...effectivePagination,
                pageIndex: effectivePagination.pageIndex + 1,
              })
            }
          >
            Next
          </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
