import { useState } from "react";
import { useStock } from "../hooks/useStock";
import { getStockMovements } from "../api/stock.api";
import { DataTable } from "@/shared/components/DataTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useQuery } from "@tanstack/react-query";

const stockColumns = [
  /* ... */
];
const movementColumns = [
  /* ... */
];

export default function StockPage() {
  const [branchId, setBranchId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const { data: stock } = useStock({ branchId, warehouseId });
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const { data: movements } = useQuery({
    queryKey: ["movements", selectedStock],
    queryFn: () => getStockMovements(selectedStock!),
    enabled: !!selectedStock,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Inventory</h1>
      <div className="flex gap-4">
        <Select onValueChange={setBranchId}>
          <SelectTrigger>
            <SelectValue placeholder="Branch" />
          </SelectTrigger>
          <SelectContent>{/* options from branches */}</SelectContent>
        </Select>
        <Select onValueChange={setWarehouseId}>
          <SelectTrigger>
            <SelectValue placeholder="Warehouse" />
          </SelectTrigger>
          <SelectContent>{/* options */}</SelectContent>
        </Select>
      </div>
      <DataTable
        columns={stockColumns}
        data={stock || []}
        pagination={{ pageIndex: 0, pageSize: 10 }}
        pageCount={1}
        onPaginationChange={() => {}}
        onRowClick={(row) => setSelectedStock(row.id)}
      />
      {selectedStock && (
        <div>
          <h2 className="text-xl">Movements</h2>
          <DataTable columns={movementColumns} data={movements || []} />
        </div>
      )}
    </div>
  );
}
