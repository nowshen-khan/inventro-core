import { useMemo, useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
import { useCreateSaleReturn } from "../hooks/useCreateSaleReturn";

export default function SaleReturnFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const saleIdFromQuery = searchParams.get("saleId");
  const [saleId, setSaleId] = useState("");

  const [items, setItems] = useState<any[]>([]);

  const [refundAmount, setRefundAmount] = useState(0);

  useEffect(() => {
    const total = items.reduce((sum, item) => sum + Number(item.totalPrice), 0);

    setRefundAmount(total);
  }, [items]);

  const [note, setNote] = useState("");

  const { data: sales } = useSales();

  const mutation = useCreateSaleReturn();

  useEffect(() => {
    if (saleIdFromQuery && sales?.length) {
      handleSaleChange(saleIdFromQuery);
    }
  }, [saleIdFromQuery, sales]);

  const selectedSale = useMemo(() => {
    return sales?.find((s: any) => s.id === saleId);
  }, [saleId, sales]);

  const handleSaleChange = (value: string) => {
    setSaleId(value);

    const sale = sales?.find((s: any) => s.id === value);

    if (!sale) return;

    const mappedItems = sale.items.map((item: any) => ({
      productVariantId: item.productVariantId,

      quantity: 1,

      maxQty: item.quantity,

      sellingPrice: item.sellingPrice,

      totalPrice: item.sellingPrice,

      variant: item.variant,
    }));

    setItems(mappedItems);

    setRefundAmount(sale.totalAmount);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...items];

    updated[index][field] = value;

    if (field === "quantity") {
      updated[index].totalPrice =
        Number(value) * Number(updated[index].sellingPrice);
    }

    setItems(updated);
  };

  const handleSubmit = async () => {
    if (!selectedSale) {
      return alert("Select sale");
    }

    try {
      await mutation.mutateAsync({
        saleId: selectedSale.id,

        customerId: selectedSale.customerId,

        branchId: selectedSale.branchId,

        locationId: "LOCATION_ID",

        refundAmount,

        note,

        items: items
          .filter((item) => item.quantity > 0)
          .map((item) => ({
            productVariantId: item.productVariantId,

            quantity: Number(item.quantity),

            sellingPrice: Number(item.sellingPrice),

            totalPrice: Number(item.totalPrice),
          })),
      });

      alert("Sale return created");

      navigate("/sale-returns");
    } catch (error) {
      console.error(error);

      alert("Failed to create return");
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Sale Return</h1>
      </div>

      <div className="space-y-6">
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

        <Input
          type="number"
          placeholder="Refund Amount"
          value={refundAmount}
          onChange={(e) => setRefundAmount(Number(e.target.value))}
        />

        <Input
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="space-y-4">
          {items.map((item, index) => (
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
                onChange={(e) => updateItem(index, "quantity", e.target.value)}
              />

              <Input
                type="number"
                value={item.sellingPrice}
                onChange={(e) =>
                  updateItem(index, "sellingPrice", e.target.value)
                }
              />

              <Input type="number" value={item.totalPrice} readOnly />

              <Button
                variant="destructive"
                onClick={() => setItems(items.filter((_, i) => i !== index))}
              >
                Remove
              </Button>

              <div className="flex items-center text-sm text-slate-500">
                Max: {item.maxQty}
              </div>
            </div>
          ))}
        </div>

        <Button onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? "Creating..." : "Create Return"}
        </Button>
      </div>
    </div>
  );
}
