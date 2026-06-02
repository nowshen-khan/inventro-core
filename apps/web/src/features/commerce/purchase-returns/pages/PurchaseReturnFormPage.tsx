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
import { usePurchases } from "@/features/commerce/purchases/hooks/usePurchases";
import { useCreatePurchaseReturn } from "../hooks/useCreatePurchaseReturn";

export default function PurchaseReturnFormPage() {
  const navigate = useNavigate();

  const [purchaseId, setPurchaseId] = useState("");

  const [items, setItems] = useState<any[]>([]);

  const [note, setNote] = useState("");

  const { data: purchases } = usePurchases();

  const mutation = useCreatePurchaseReturn();

  const selectedPurchase = useMemo(() => {
    return purchases?.find((p: any) => p.id === purchaseId);
  }, [purchaseId, purchases]);

  const handlePurchaseChange = (value: string) => {
    setPurchaseId(value);

    const purchase = purchases?.find((p: any) => p.id === value);

    if (!purchase) return;

    const mappedItems = purchase.items.map((item: any) => ({
      productVariantId: item.productVariantId,

      quantity: 1,

      maxQty: item.quantity,

      costPrice: item.costPrice,

      totalPrice: item.costPrice,

      variant: item.variant,
    }));

    setItems(mappedItems);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const updated = [...items];

    updated[index][field] = value;

    if (field === "quantity") {
      updated[index].totalPrice =
        Number(value) * Number(updated[index].costPrice);
    }

    setItems(updated);
  };

  const handleSubmit = async () => {
    if (!selectedPurchase) {
      return alert("Select purchase");
    }

    try {
      await mutation.mutateAsync({
        purchaseId: selectedPurchase.id,

        supplierId: selectedPurchase.supplierId,

        branchId: selectedPurchase.branchId,

        note,

        items: items.map((item) => ({
          productVariantId: item.productVariantId,

          quantity: Number(item.quantity),

          costPrice: Number(item.costPrice),

          totalPrice: Number(item.totalPrice),
        })),
      });

      alert("Purchase return created");

      navigate("/purchase-returns");
    } catch (error) {
      console.error(error);

      alert("Failed to create return");
    }
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Purchase Return</h1>
      </div>

      <div className="space-y-6">
        <Select value={purchaseId} onValueChange={handlePurchaseChange}>
          <SelectTrigger>
            <SelectValue placeholder="Select Purchase" />
          </SelectTrigger>

          <SelectContent>
            {purchases?.map((purchase: any) => (
              <SelectItem key={purchase.id} value={purchase.id}>
                {purchase.invoiceNo}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <div className="space-y-4">
          {items.map((item, index) => (
            <div
              key={index}
              className="grid grid-cols-1 gap-4 rounded-xl border p-4 md:grid-cols-4"
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
                value={item.costPrice}
                onChange={(e) => updateItem(index, "costPrice", e.target.value)}
              />

              <Input type="number" value={item.totalPrice} readOnly />
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
