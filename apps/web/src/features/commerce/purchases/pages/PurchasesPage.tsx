import { useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { DataTable } from "@/shared/components/DataTable";
import { usePurchases } from "../hooks/usePurchases";
import type { ColumnDef } from "@tanstack/react-table";

export default function PurchasesPage() {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    pageIndex: 0,

    pageSize: 10,
  });

  const { data, isLoading } = usePurchases({
    page: pagination.pageIndex + 1,

    limit: pagination.pageSize,
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "invoiceNo",

      header: "Invoice",
    },

    {
      accessorKey: "supplier.name",

      header: "Supplier",
    },

    {
      accessorKey: "totalAmount",

      header: "Total",

      cell: ({ row }) => <span>৳{row.original.totalAmount}</span>,
    },

    {
      accessorKey: "paidAmount",

      header: "Paid",

      cell: ({ row }) => <span>৳{row.original.paidAmount}</span>,
    },

    {
      id: "due",

      header: "Due",

      cell: ({ row }) => {
        const due = row.original.totalAmount - row.original.paidAmount;

        return <span>৳{due}</span>;
      },
    },

    {
      id: "items",

      header: "Items",

      cell: ({ row }) => row.original.items?.length || 0,
    },

    {
      accessorKey: "createdAt",

      header: "Date",

      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },
    {
      id: "actions",

      header: "Actions",

      cell: ({ row }) => (
        <Button
          size="sm"
          variant="outline"
          onClick={() => navigate(`/purchases/${row.original.id}`)}
        >
          <Eye size={16} />
        </Button>
      ),
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Purchases</h1>

        <Button onClick={() => navigate("/purchases/new")}>Add Purchase</Button>
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
