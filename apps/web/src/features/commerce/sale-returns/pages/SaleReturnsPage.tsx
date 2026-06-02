import { useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/shared/components/DataTable";
import { Button } from "@/shared/components/ui/button";
import { useSaleReturns } from "../hooks/useSaleReturns";

export default function SaleReturnsPage() {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    pageIndex: 0,

    pageSize: 10,
  });

  const { data, isLoading } = useSaleReturns();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "returnNo",

      header: "Return No",
    },

    {
      accessorKey: "sale.invoiceNo",

      header: "Sale Invoice",
    },

    {
      accessorKey: "customer.name",

      header: "Customer",
    },

    {
      accessorKey: "refundAmount",

      header: "Refund",

      cell: ({ row }) => <span>৳{row.original.refundAmount}</span>,
    },

    {
      accessorKey: "totalAmount",

      header: "Total",

      cell: ({ row }) => <span>৳{row.original.totalAmount}</span>,
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
          onClick={() => navigate(`/sale-returns/${row.original.id}`)}
        >
          <Eye size={16} />
        </Button>
      ),
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Sale Returns</h1>

        <Button onClick={() => navigate("/sale-returns/new")}>
          Create Return
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
