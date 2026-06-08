import { useState, useEffect, useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { posSearchProducts } from "@/features/catalog/products/api/products.api";
import { useCreateTransfer } from "@/features/inventory/transfers/hooks/useCreateTransfer";
import { useWarehouses } from "@/features/inventory/locations/hooks/useLocations";
import { useNavigate } from "react-router-dom";

export default function TransferFormPage() {
  const [items, setItems] = useState([]);

  const [barcode, setBarcode] = useState("");

  const barcodeRef = useRef<HTMLInputElement>(null);
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();

  const createTransfer = useCreateTransfer();

  const { data: warehouses } = useWarehouses();

  const [sourceWarehouseId, setSourceWarehouseId] = useState("");

  const [destWarehouseId, setDestWarehouseId] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!barcode || barcode.length < 3) return;

      try {
        const data = await posSearchProducts(barcode);

        if (data?.length) {
          setProduct(data[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [barcode]);

  const handleAddItem = () => {
    if (!product) return;

    const currentStock = Number(product?.stocks?.[0]?.quantity || 0);

    if (quantity <= 0) {
      alert("Invalid quantity");
      return;
    }

    if (quantity > currentStock) {
      alert("Insufficient stock");
      return;
    }

    const existing = items.find(
      (item: any) => item.productVariantId === product.id,
    );

    if (existing) {
      const updatedQty = existing.quantity + quantity;

      if (updatedQty > currentStock) {
        alert("Stock exceeded");
        return;
      }

      setItems(
        items.map((item: any) =>
          item.productVariantId === product.id
            ? {
                ...item,
                quantity: updatedQty,
              }
            : item,
        ),
      );
    } else {
      setItems([
        ...items,
        {
          productVariantId: product.id,
          barcode: product.barcode,
          productName: product.product.name,
          styleCode: product.product.styleCode,
          color: product.color,
          size: product.size,
          quantity,
        },
      ]);
    }

    setBarcode("");
    setProduct(null);
    setQuantity(1);

    setTimeout(() => {
      barcodeRef.current?.focus();
    }, 100);
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold">Store Delivery</h1>
      </div>

      {/* BODY */}

      <div className="grid grid-cols-12 gap-4">
        {/* LEFT PANEL */}

        <Card className="col-span-12 lg:col-span-3">
          <CardContent className="space-y-4 p-4">
            {/* FROM */}

            <div>
              <label className="mb-1 block text-sm font-medium">
                From Warehouse
              </label>

              <select
                className="w-full rounded-md border p-2"
                value={sourceWarehouseId}
                onChange={(e) => setSourceWarehouseId(e.target.value)}
              >
                <option value="">Select Warehouse</option>

                {warehouses?.map((warehouse: any) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>

            {/* TO */}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Delivery To
              </label>

              <select
                className="w-full rounded-md border p-2"
                value={destWarehouseId}
                onChange={(e) => setDestWarehouseId(e.target.value)}
              >
                <option value="">Select Warehouse</option>

                {warehouses?.map((warehouse: any) => (
                  <option key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </option>
                ))}
              </select>
            </div>

            {/* DATE */}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Delivery Date
              </label>

              <Input type="date" />
            </div>

            {/* BARCODE */}

            <div>
              <label className="mb-1 block text-sm font-medium">Barcode</label>

              <Input
                placeholder="Barcode Scan"
                value={barcode}
                ref={barcodeRef}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();

                    handleAddItem();
                  }
                }}
              />
            </div>

            {/* PRODUCT */}

            <div>
              <label className="mb-1 block text-sm font-medium">Product</label>

              <textarea
                className="w-full rounded-md border p-2"
                rows={2}
                value={
                  product
                    ? `${product.product.name} (${product.color} / ${product.size})`
                    : ""
                }
                readOnly
              />
            </div>

            {/* STOCK */}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Current Stock
              </label>

              <Input readOnly value={product?.stocks?.[0]?.quantity || 0} />
            </div>

            {/* QTY */}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Delivery Quantity
              </label>

              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              />
            </div>

            {/* ACTIONS */}

            <div className="flex flex-wrap gap-2 pt-4">
              <Button onClick={handleAddItem}>Add</Button>

              <Button variant="outline">Preview</Button>

              <Button
                variant="secondary"
                onClick={() => {
                  if (!items.length) return;

                  if (sourceWarehouseId === destWarehouseId) {
                    alert("Source and destination warehouse cannot be same");

                    return;
                  }

                  if (!sourceWarehouseId || !destWarehouseId) {
                    alert("Select warehouses");

                    return;
                  }

                  createTransfer.mutate(
                    {
                      transferNo: `TR-${Date.now()}`,

                      sourceWarehouseId,

                      destWarehouseId,

                      items: items.map((item: any) => ({
                        productVariantId: item.productVariantId,

                        quantity: item.quantity,
                      })),
                    },

                    {
                      onSuccess: (transfer) => {
                        navigate(`/transfers/${transfer.id}`);
                      },
                    },
                  );
                }}
              >
                Save
              </Button>

              <Button variant="destructive">Reset</Button>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT PANEL */}

        <Card className="col-span-12 lg:col-span-9">
          <CardContent className="p-4">
            {/* SUMMARY */}

            <div className="mb-4 flex justify-end gap-6">
              <div className="rounded-lg bg-orange-100 px-4 py-2 text-sm font-semibold">
                Items: {items.length}
              </div>

              <div className="rounded-lg bg-orange-100 px-4 py-2 text-sm font-semibold">
                Qty:{" "}
                {items.reduce(
                  (sum: number, item: any) => sum + item.quantity,
                  0,
                )}
              </div>
            </div>

            {/* TABLE */}

            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-slate-100">
                    <th className="p-3 text-left">Barcode</th>

                    <th className="p-3 text-left">Product</th>

                    <th className="p-3 text-left">Style</th>

                    <th className="p-3 text-left">Color</th>

                    <th className="p-3 text-left">Size</th>

                    <th className="p-3 text-left">Qty</th>

                    <th className="p-3 text-left">Action</th>
                  </tr>
                </thead>

                {/* <tbody>
                  {items.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="p-10 text-center text-slate-400"
                      >
                        No products added
                      </td>
                    </tr>
                  )}
                </tbody> */}

                <tbody>
                  {items.map((item: any, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{item.barcode}</td>

                      <td className="p-3">{item.productName}</td>

                      <td className="p-3">{item.styleCode}</td>

                      <td className="p-3">{item.color}</td>

                      <td className="p-3">{item.size}</td>

                      <td className="p-3">{item.quantity}</td>

                      <td className="p-3">
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            setItems(items.filter((_: any, i) => i !== index))
                          }
                        >
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
