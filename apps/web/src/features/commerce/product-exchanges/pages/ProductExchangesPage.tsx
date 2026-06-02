import { useState } from "react";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/shared/components/DataTable";
import { Button } from "@/shared/components/ui/button";
import { useProductExchanges } from "../hooks/useProductExchanges";

export default function ProductExchangesPage() {
  const navigate = useNavigate();

  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading } = useProductExchanges();

  const columns: ColumnDef<any>[] = [
    {
      accessorKey: "exchangeNo",

      header: "Exchange No",
    },

    {
      accessorKey: "originalSale.invoiceNo",

      header: "Original Invoice",
    },

    {
      accessorKey: "exchangeAmount",

      header: "Additional Payment",

      cell: ({ row }) => <span>৳{row.original.exchangeAmount}</span>,
    },

    {
      accessorKey: "refundAmount",

      header: "Refund",

      cell: ({ row }) => <span>৳{row.original.refundAmount}</span>,
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
          onClick={() => navigate(`/product-exchanges/${row.original.id}`)}
        >
          <Eye size={16} />
        </Button>
      ),
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Product Exchanges</h1>

        <Button onClick={() => navigate("/product-exchanges/new")}>
          Create Exchange
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
