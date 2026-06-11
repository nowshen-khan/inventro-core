import { Eye } from "lucide-react";

import { useNavigate } from "react-router-dom";

import type { ColumnDef } from "@tanstack/react-table";

import { DataTable } from "@/shared/components/DataTable";
import { Button } from "@/shared/components/ui/button";
import { useStockAdjustments } from "@/features/inventory/stock-adjustments/hooks/useStockAdjustments";

export default function StockAdjustmentsPage() {
  const navigate = useNavigate();

  const { data, isLoading } = useStockAdjustments();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "adjustmentNo",

      header: "Adjustment No",
    },

    {
      accessorKey: "location.name",

      header: "Location",
    },

    {
      accessorKey: "createdAt",

      header: "Date",

      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },

    {
      accessorKey: "items",

      header: "Items",

      cell: ({ row }) => row.original.items?.length,
    },

    {
      id: "actions",

      header: "Actions",

      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/stock-adjustments/${row.original.id}`)}
        >
          <Eye size={16} />
        </Button>
      ),
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      {/* HEADER */}

      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Stock Adjustments</h1>

        <Button onClick={() => navigate("/stock-adjustments/new")}>
          New Adjustment
        </Button>
      </div>

      {/* TABLE */}

      <DataTable
        columns={columns}
        data={data || []}
        pagination={{
          pageIndex: 0,
          pageSize: 10,
        }}
        pageCount={1}
        onPaginationChange={() => {}}
        isLoading={isLoading}
      />
    </div>
  );
}
