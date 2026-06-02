import type { ColumnDef } from "@tanstack/react-table";
import { Minus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useCartStore } from "@/features/commerce/sales/stores/cartStore";

export const cartColumns: ColumnDef<any>[] = [
  {
    accessorKey: "productName",

    header: "Product",
    cell: ({ row }) => (
      <div>
        {" "}
        <p className="font-medium"> {row.original.productName} </p>{" "}
        <p className="text-xs text-slate-500">
          {" "}
          {row.original.attributes}{" "}
        </p>{" "}
      </div>
    ),
  },

  {
    accessorKey: "sku",

    header: "SKU",
  },

  {
    id: "quantity",

    header: "Qty",
    cell: ({ row }) => {
      const increaseQty = useCartStore((s) => s.increaseQty);
      const decreaseQty = useCartStore((s) => s.decreaseQty);
      return (
        <div className="flex items-center gap-2">
          {" "}
          <Button
            size="icon"
            variant="outline"
            onClick={() => decreaseQty(row.original.variantId)}
          >
            {" "}
            <Minus size={14} />{" "}
          </Button>{" "}
          <span className="min-w-[20px] text-center">
            {" "}
            {row.original.quantity}{" "}
          </span>{" "}
          <Button
            size="icon"
            variant="outline"
            onClick={() => increaseQty(row.original.variantId)}
          >
            {" "}
            <Plus size={14} />{" "}
          </Button>{" "}
        </div>
      );
    },
  },

  {
    accessorKey: "price",

    header: "Price",

    cell: ({ row }) => <span>৳{Number(row.original.price).toFixed(2)}</span>,
  },

  {
    id: "total",

    header: "Total",

    cell: ({ row }) => (
      <span className="font-semibold">
        ৳
        {(Number(row.original.price) * Number(row.original.quantity)).toFixed(
          2,
        )}
      </span>
    ),
  },

  {
    id: "actions",

    header: "Actions",

    cell: ({ row }) => {
      const removeItem = useCartStore((s) => s.removeItem);
      return (
        <Button
          size="icon"
          variant="destructive"
          onClick={() => removeItem(row.original.variantId)}
        >
          <Trash2 size={16} />
        </Button>
      );
    },
  },
];
