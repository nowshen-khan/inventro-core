import { useMemo, useState } from "react";
import api from "@/shared/api/client.api";
import { DataTable } from "@/shared/components/DataTable";
import { BarcodeScanner } from "@/shared/components/BarcodeScanner";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { usePosProducts } from "../hooks/usePosProducts";
import { cartColumns } from "../components/cart-columns";
import { useCreateSale } from "../hooks/useCreateSale";
import { useCartStore } from "@/features/commerce/sales/stores/cartStore";
import { useAuthStore } from "@/features/auth/stores/authStore";

export default function PointOfSale() {
  const user = useAuthStore((s) => s.user);

  const { items, addItem, clearCart } = useCartStore();

  const createSale = useCreateSale();

  const [search, setSearch] = useState("");

  const [paidAmount, setPaidAmount] = useState(0);

  const [discount, setDiscount] = useState(0);

  const [customerId, setCustomerId] = useState("");

  const { data: products } = usePosProducts(search);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const total = subtotal - discount;

  const due = total - paidAmount;

  const handleBarcodeScan = async (barcode: string) => {
    try {
      const { data } = await api.get(`/products/barcode/${barcode}`);

      addItem({
        variantId: data.id,

        productName: data.product?.name,

        sku: data.sku,

        attributes: `${data.color || ""} ${data.size || ""}`,

        quantity: 1,

        price: Number(data.sellingPrice),
      });
    } catch (error) {
      console.error(error);

      alert("Product not found");
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      return alert("Cart is empty");
    }

    try {
      await createSale.mutateAsync({
        branchId: user?.branchId,
        locationId: "LOCATION_ID",
        customerId: customerId || undefined,
        discount,
        tax: 0,
        paidAmount,
        paymentMethod: "CASH",

        items: items.map((item) => ({
          productVariantId: item.variantId,
          quantity: item.quantity,
          sellingPrice: item.price,
          totalPrice: item.price * item.quantity,
        })),
      });

      alert("Sale completed");

      clearCart();
      setPaidAmount(0);
      setDiscount(0);
      setCustomerId("");
    } catch (error) {
      console.error(error);

      alert("Sale failed");
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* LEFT */}

      <div className="space-y-4 lg:col-span-2">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <div className="mb-4 flex flex-col gap-4 md:flex-row">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <BarcodeScanner onScan={handleBarcodeScan} />
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            {products?.map((product: any) => (
              <button
                key={product.id}
                type="button"
                className={`rounded-xl border p-4 text-left transition ${
                  (product.stocks?.[0]?.quantity || 0) <= 0
                    ? "cursor-not-allowed opacity-50"
                    : "hover:border-black"
                }`}
                disabled={(product.stocks?.[0]?.quantity || 0) <= 0}
                onClick={() =>
                  addItem({
                    variantId: product.id,

                    productName: product.product?.name,

                    sku: product.sku,

                    attributes: `${product.color || ""} ${product.size || ""}`,

                    quantity: 1,

                    price: Number(product.sellingPrice),
                  })
                }
              >
                <p className="font-medium">{product.product?.name}</p>

                <p className="text-sm text-slate-500">{product.sku}</p>

                <p className="text-sm text-slate-500">
                  {product.color}
                  {" / "}
                  {product.size}
                </p>

                <div className="mt-2 flex items-center justify-between">
                  <p className="font-semibold">৳{product.sellingPrice}</p>

                  <p
                    className={`text-sm ${
                      (product.stocks?.[0]?.quantity || 0) <= 0
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    Stock: {product.stocks?.[0]?.quantity || 0}
                  </p>
                </div>
              </button>
            ))}
          </div>
          <DataTable
            columns={cartColumns}
            data={items}
            pagination={{
              pageIndex: 0,
              pageSize: 20,
            }}
            pageCount={1}
            onPaginationChange={() => {}}
          />
        </div>
      </div>

      {/* RIGHT */}

      <div className="space-y-4">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Payment</h2>

          <div className="space-y-4">
            <Input
              placeholder="Customer ID"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
            />

            <Input
              type="number"
              placeholder="Discount"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
            />

            <Input
              type="number"
              placeholder="Paid Amount"
              value={paidAmount}
              onChange={(e) => setPaidAmount(Number(e.target.value))}
            />

            <div className="space-y-2 border-t pt-4 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>

                <span>৳{subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>

                <span>৳{discount.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>

                <span>৳{total.toFixed(2)}</span>
              </div>

              <div className="flex justify-between text-red-500">
                <span>Due</span>

                <span>৳{due.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              onClick={handleCheckout}
              disabled={createSale.isPending}
            >
              {createSale.isPending ? "Processing..." : "Complete Sale"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
