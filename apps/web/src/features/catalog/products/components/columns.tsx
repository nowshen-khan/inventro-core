import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/shared/components/ui/button";
import { Link } from "react-router-dom";
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

    header: "Price",
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
