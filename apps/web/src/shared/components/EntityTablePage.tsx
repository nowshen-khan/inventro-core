import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataTable } from "@/shared/components/DataTable";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import type {
  ColumnDef,
  SortingState,
  PaginationState,
} from "@tanstack/react-table";

interface Props<T> {
  title: string;
  createPath?: string;
  queryKey: string;
  queryFn: (
    params: any,
  ) => Promise<{ items: T[]; meta: { totalPages: number } }>;
  columns: ColumnDef<T>[];
}

export function EntityTablePage<T>({
  title,
  createPath,
  queryKey,
  queryFn,
  columns,
}: Props<T>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  const [sorting, setSorting] = useState<SortingState>([]);
  const { data, isLoading } = useQuery({
    queryKey: [queryKey, pagination, sorting],
    queryFn: () =>
      queryFn({
        page: pagination.pageIndex + 1,
        limit: pagination.pageSize,
        sort: sorting,
      }),
  });
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{title}</h1>
        {createPath && (
          <Button onClick={() => navigate(createPath)}>Add New</Button>
        )}
      </div>
      {isLoading ? (
        <div className="space-y-2">
          {Array(5)
            .fill(null)
            .map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={data?.items || []}
          pagination={pagination}
          pageCount={data?.meta?.totalPages ?? -1}
          onPaginationChange={setPagination}
          sorting={sorting}
          onSortingChange={setSorting}
        />
      )}
    </div>
  );
}
