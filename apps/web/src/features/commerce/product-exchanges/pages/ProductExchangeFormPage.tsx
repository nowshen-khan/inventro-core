import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useSales } from "@/features/commerce/sales/hooks/useSales";
import { usePosProducts } from "@/features/commerce/sales/hooks/usePosProducts";
import { useCreateProductExchange } from "../hooks/useCreateProductExchange";

export default function ProductExchangeFormPage() {
  const navigate = useNavigate();

  const mutation = useCreateProductExchange();

  const { data: sales } = useSales();

  const [saleId, setSaleId] = useState("");

  const [search, setSearch] = useState("");

  const { data: products } = usePosProducts(search);

  const [returnItems, setReturnItems] = useState<any[]>([]);

  const [newItems, setNewItems] = useState<any[]>([]);

  const [note, setNote] = useState("");

  const selectedSale = useMemo(() => {
    return sales?.find((s: any) => s.id === saleId);
  }, [saleId, sales]);

  /*
    load sold items
  */

  const handleSaleChange = (value: string) => {
    setSaleId(value);

    const sale = sales?.find((s: any) => s.id === value);

    if (!sale) return;

    setReturnItems(
      sale.items.map((item: any) => ({
        productVariantId: item.productVariantId,

        quantity: 1,

        maxQty: item.quantity,

        sellingPrice: item.sellingPrice,

        totalPrice: item.sellingPrice,

        variant: item.variant,
      })),
    );
  };

  /*
    add new item
  */

  const addNewItem = (product: any) => {
    const existing = newItems.find((i) => i.productVariantId === product.id);

    if (existing) {
      setNewItems(
        newItems.map((i) =>
          i.productVariantId === product.id
            ? {
                ...i,

                quantity: i.quantity + 1,

                totalPrice: (i.quantity + 1) * i.sellingPrice,
              }
            : i,
        ),
      );

      return;
    }

    setNewItems([
      ...newItems,

      {
        productVariantId: product.id,

        quantity: 1,

        sellingPrice: Number(product.sellingPrice),

        totalPrice: Number(product.sellingPrice),

        variant: product,
      },
    ]);
  };

  /*
    update qty
  */

  const updateReturnItem = (index: number, qty: number) => {
    const updated = [...returnItems];

    updated[index].quantity = qty;

    updated[index].totalPrice = qty * updated[index].sellingPrice;

    setReturnItems(updated);
  };

  const updateNewItem = (index: number, qty: number) => {
    const updated = [...newItems];

    updated[index].quantity = qty;

    updated[index].totalPrice = qty * updated[index].sellingPrice;

    setNewItems(updated);
  };

  /*
    totals
  */

  const returnTotal = returnItems.reduce(
    (sum, item) => sum + item.totalPrice,
    0,
  );

  const newSaleTotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0);

  const difference = newSaleTotal - returnTotal;

  const exchangeAmount = difference > 0 ? difference : 0;

  const refundAmount = difference < 0 ? Math.abs(difference) : 0;

  /*
    submit
  */

  const handleSubmit = async () => {
    if (!selectedSale) {
      return alert("Select sale");
    }

    if (newItems.length === 0) {
      return alert("Add exchange items");
    }

    try {
      await mutation.mutateAsync({
        originalSaleId: selectedSale.id,

        customerId: selectedSale.customerId,

        branchId: selectedSale.branchId,

        locationId: "LOCATION_ID",

        returnItems: returnItems.map((item) => ({
          productVariantId: item.productVariantId,

          quantity: Number(item.quantity),

          sellingPrice: Number(item.sellingPrice),

          totalPrice: Number(item.totalPrice),
        })),

        newItems: newItems.map((item) => ({
          productVariantId: item.productVariantId,

          quantity: Number(item.quantity),

          sellingPrice: Number(item.sellingPrice),

          totalPrice: Number(item.totalPrice),
        })),

        exchangeAmount,

        refundAmount,

        note,
      });

      alert("Exchange created");

      navigate("/product-exchanges");
    } catch (error) {
      console.error(error);

      alert("Exchange failed");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold">Product Exchange</h1>
      </div>

      {/* SALE SELECT */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <Select value={saleId} onValueChange={handleSaleChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Sale" />
          </SelectTrigger>

          <SelectContent>
            {sales?.map((sale: any) => (
              <SelectItem key={sale.id} value={sale.id}>
                {sale.invoiceNo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* RETURN ITEMS */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold">Return Items</h2>

        <div className="space-y-4">
          {returnItems.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-4 rounded-xl border p-4 md:grid-cols-5"
            >
              <div>
                <p className="font-medium">{item.variant?.product?.name}</p>

                <p className="text-sm text-slate-500">
                  {item.variant?.color}
                  {" / "}
                  {item.variant?.size}
                </p>
              </div>

              <Input
                type="number"
                min={1}
                max={item.maxQty}
                value={item.quantity}
                onChange={(e) =>
                  updateReturnItem(index, Number(e.target.value))
                }
              />

              <div className="flex items-center">৳{item.sellingPrice}</div>

              <div className="flex items-center font-medium">
                ৳{item.totalPrice}
              </div>

              <div className="flex items-center text-sm text-slate-500">
                Max: {item.maxQty}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEARCH */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Add New Product</h2>

        <Input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {products?.map((product: any) => (
            <button
              key={product.id}
              type="button"
              onClick={() => addNewItem(product)}
              className="rounded-xl border p-4 text-left transition hover:border-black"
            >
              <p className="font-medium">{product.product?.name}</p>

              <p className="text-sm text-slate-500">{product.sku}</p>

              <p className="text-sm text-slate-500">
                {product.color}
                {" / "}
                {product.size}
              </p>

              <p className="mt-2 font-semibold">৳{product.sellingPrice}</p>
            </button>
          ))}
        </div>
      </div>

      {/* NEW ITEMS */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold">Exchange Items</h2>

        <div className="space-y-4">
          {newItems.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-4 rounded-xl border p-4 md:grid-cols-4"
            >
              <div>
                <p className="font-medium">{item.variant?.product?.name}</p>
              </div>

              <Input
                type="number"
                min={1}
                value={item.quantity}
                onChange={(e) => updateNewItem(index, Number(e.target.value))}
              />

              <div className="flex items-center">৳{item.sellingPrice}</div>

              <div className="flex items-center font-medium">
                ৳{item.totalPrice}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SUMMARY */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Return Total</span>

            <span>৳{returnTotal}</span>
          </div>

          <div className="flex justify-between">
            <span>New Sale Total</span>

            <span>৳{newSaleTotal}</span>
          </div>

          <div className="flex justify-between text-lg font-bold">
            <span>{exchangeAmount > 0 ? "Customer Pays" : "Refund"}</span>

            <span>৳{exchangeAmount > 0 ? exchangeAmount : refundAmount}</span>
          </div>
        </div>

        <Input
          className="mt-4"
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <Button
          className="mt-6"
          onClick={handleSubmit}
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Creating..." : "Complete Exchange"}
        </Button>
      </div>
    </div>
  );
}
