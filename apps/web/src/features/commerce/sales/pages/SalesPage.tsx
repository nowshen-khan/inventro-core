import { useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/shared/components/DataTable";
import { Button } from "@/shared/components/ui/button";
import { useSales } from "../hooks/useSales";

export default function SalesPage() {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    pageIndex: 0,

    pageSize: 10,
  });

  const { data, isLoading } = useSales({
    page: pagination.pageIndex + 1,

    limit: pagination.pageSize,
  });

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "invoiceNo",

      header: "Invoice",
    },

    {
      accessorKey: "customer.name",

      header: "Customer",
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
      accessorKey: "createdAt",

      header: "Date",

      cell: ({ row }) => new Date(row.original.createdAt).toLocaleDateString(),
    },

    {
      id: "actions",

      header: "Actions",

      cell: ({ row }) => (
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => navigate(`/sales/${row.original.id}`)}
          >
            <Eye size={16} />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={() =>
              navigate(`/sale-returns/new?saleId=${row.original.id}`)
            }
          >
            Return
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sales</h1>

        <Button onClick={() => navigate("/sales/pos")}>New Sale</Button>
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
