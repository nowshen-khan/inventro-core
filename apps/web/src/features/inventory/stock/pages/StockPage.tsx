import { useState } from "react";
import { Eye } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/shared/components/DataTable";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { getStockMovements } from "../api/stock.api";
import { useStock } from "../hooks/useStock";

export default function StockPage() {
  const [locationId, setLocationId] = useState("");
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const { data: stock } = useStock({ locationId });
  const { data: movements } = useQuery({
    queryKey: ["movements", selectedStock],
    queryFn: () => getStockMovements(selectedStock!),
    enabled: !!selectedStock,
  });

  const stockColumns: ColumnDef<any>[] = [
    {
      header: "Product",
      cell: ({ row }) => row.original.variant?.product?.name || "-",
    },
    {
      header: "Style",
      cell: ({ row }) => row.original.variant?.product?.styleCode || "-",
    },
    {
      header: "Barcode",
      cell: ({ row }) => row.original.variant?.barcode || "-",
    },
    {
      header: "Location",
      cell: ({ row }) => row.original.location?.name || "-",
    },
    {
      accessorKey: "quantity",
      header: "Physical Stock",
    },
    {
      accessorKey: "reservedQuantity",
      header: "Reserved Stock",
    },
    {
      accessorKey: "availableQuantity",
      header: "Available Stock",
      cell: ({ row }) => (
        <span
          className={
            row.original.availableQuantity <= 0
              ? "font-semibold text-red-600"
              : "font-semibold"
          }
        >
          {row.original.availableQuantity}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => setSelectedStock(row.original.id)}
        >
          <Eye size={16} />
        </Button>
      ),
    },
  ];

  const movementColumns: ColumnDef<any>[] = [
    {
      accessorKey: "type",
      header: "Type",
    },
    {
      accessorKey: "quantity",
      header: "Qty",
    },
    {
      accessorKey: "referenceId",
      header: "Reference",
    },
    {
      accessorKey: "createdAt",
      header: "Date",
      cell: ({ row }) => new Date(row.original.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inventory</h1>
      <div className="flex gap-4">
        <Select onValueChange={setLocationId}>
          <SelectTrigger>
            <SelectValue placeholder="Location" />
          </SelectTrigger>
          <SelectContent>{/* location options */}</SelectContent>
        </Select>
      </div>
      <DataTable
        columns={stockColumns}
        data={stock || []}
        pagination={{ pageIndex: 0, pageSize: 10 }}
        pageCount={1}
        onPaginationChange={() => {}}
      />
      {selectedStock && (
        <div>
          <h2 className="mb-3 text-xl">Movements</h2>
          <DataTable
            columns={movementColumns}
            data={movements || []}
            pagination={{ pageIndex: 0, pageSize: 10 }}
            pageCount={1}
            onPaginationChange={() => {}}
          />
        </div>
      )}
    </div>
  );
}
