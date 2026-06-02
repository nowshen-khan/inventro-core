import { useTransfers } from "../hooks/useTransfers";
import { useApproveTransfer } from "../hooks/useApproveTransfer";
import { DataTable } from "@/shared/components/DataTable";
import { Button } from "@/shared/components/ui/button";
import type { ColumnDef } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";

const columns: ColumnDef<any>[] = [
  { accessorKey: "transferNo", header: "Transfer No" },
  { accessorKey: "sourceWarehouse.name", header: "From" },
  { accessorKey: "destWarehouse.name", header: "To" },
  { accessorKey: "status", header: "Status" },
  {
    id: "approve",
    cell: ({ row }) =>
      row.original.status === "PENDING" ? (
        <Button
          size="sm"
          onClick={() => approveTransfer.mutate(row.original.id)}
        >
          Approve
        </Button>
      ) : null,
  },
];

export default function TransfersPage() {
  const { data: transfers, isLoading } = useTransfers();
  const approveTransfer = useApproveTransfer();
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <h1 className="text-2xl font-bold mb-4">Stock Transfers</h1>
        <Button onClick={() => navigate("/transfers/new")}>New Transfer</Button>
      </div>

      <DataTable
        columns={columns}
        data={transfers || []}
        pagination={{ pageIndex: 0, pageSize: 10 }}
        pageCount={1}
        onPaginationChange={() => {}}
      />
    </div>
  );
}
