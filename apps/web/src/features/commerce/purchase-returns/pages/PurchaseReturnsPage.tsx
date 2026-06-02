import { useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/shared/components/DataTable";
import { Button } from "@/shared/components/ui/button";
import { usePurchaseReturns } from "../hooks/usePurchaseReturns";

export default function PurchaseReturnsPage() {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    pageIndex: 0,

    pageSize: 10,
  });

  const { data, isLoading } = usePurchaseReturns({
    page: pagination.pageIndex + 1,

    limit: pagination.pageSize,
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "returnNo",

      header: "Return No",
    },

    {
      accessorKey: "purchase.invoiceNo",

      header: "Purchase Invoice",
    },

    {
      accessorKey: "supplier.name",

      header: "Supplier",
    },

    {
      accessorKey: "totalAmount",

      header: "Amount",

      cell: ({ row }) => <span>৳{row.original.totalAmount}</span>,
    },

    {
      accessorKey: "createdAt",

      header: "Date",

      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },

    {
      id: "items",

      header: "Items",

      cell: ({ row }) => row.original.items?.length || 0,
    },

    {
      id: "actions",

      header: "Actions",

      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/purchase-returns/${row.original.id}`)}
        >
          <Eye size={16} />
        </Button>
      ),
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Purchase Returns</h1>

        <Button onClick={() => navigate("/purchase-returns/new")}>
          Add Return
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={data || []}
        pagination={pagination}
        pageCount={1}
        onPaginationChange={setPagination}
        isLoading={isLoading}
      />
    </div>
  );
}
