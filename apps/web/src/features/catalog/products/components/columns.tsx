import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
import { History } from "lucide-react";
import { useDeleteProduct } from "../hooks/useDeleteProduct";
import type { Product } from "@repo/types/product";

function ProductActionsCell({ product }: { product: Product }) {
  const deleteMutation = useDeleteProduct();

  const handleDelete = async () => {
    const confirmDelete = window.confirm("Delete this product?");

    if (!confirmDelete) return;

    try {
      await deleteMutation.mutateAsync(product.id);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex gap-2">
      <Link to={`/products/${product.id}/edit`}>
        <Button size="sm" variant="outline">
          Edit
        </Button>
      </Link>

      <Link to={`/products/${product.id}/audit-logs`}>
        <Button size="sm" variant="outline">
          <History className="h-4 w-4" />
        </Button>
      </Link>

      <Button size="sm" variant="destructive" onClick={handleDelete}>
        Delete
      </Button>
    </div>
  );
}

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "name",
    header: "Product",
  },

  {
    accessorFn: (row) => row.variants?.[0]?.sku,

    header: "SKU",
  },

  {
    accessorFn: (row) => row.variants?.[0]?.sellingPrice,

    header: "Selling Price",
    cell: ({ getValue }) => `$${getValue()}`,
  },

  {
    accessorFn: (row) => row.variants?.[0]?.mrp,
    header: "MRP",
    cell: ({ getValue }) => `$${getValue()}`,
  },

  {
    accessorFn: (row) =>
      row.variants?.reduce(
        (acc: number, variant: any) =>
          acc +
          (variant.stocks.reduce(
            (sum: number, stock: any) => sum + stock.quantity,
            0,
          ) || 0),
        0,
      ),
    header: "Stock",
  },
  {
    id: "actions",

    cell: ({ row }) => {
      return <ProductActionsCell product={row.original} />;
    },
  },
];
