import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useLocations } from "@/features/inventory/locations/hooks/useLocations";
import { posSearchProducts } from "@/features/catalog/products/api/products.api";
import { useCreateStockAdjustment } from "@/features/inventory/stock-adjustments/hooks/useCreateStockAdjustment";

export default function StockAdjustmentFormPage() {
  const navigate = useNavigate();
  const barcodeRef = useRef<HTMLInputElement>(null);
  const { data: locationsData } = useLocations();
  const locations = locationsData?.items ?? [];
  const createAdjustment = useCreateStockAdjustment();
  const [locationId, setLocationId] = useState("");
  const [barcode, setBarcode] = useState("");
  const [product, setProduct] = useState<any>(null);
  const [physicalQuantity, setPhysicalQuantity] = useState(0);
  const [items, setItems] = useState<any[]>([]);

  // PRODUCT SEARCH
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

  // ADD ITEM

  const handleAddItem = () => {
    if (!product) return;

    const systemQuantity = Number(product?.stocks?.[0]?.quantity || 0);

    const difference = physicalQuantity - systemQuantity;

    const existing = items.find((item) => item.productVariantId === product.id);

    if (existing) {
      alert("Product already added");

      return;
    }

    setItems([
      ...items,

      {
        productVariantId: product.id,
        barcode: product.barcode,
        productName: product.product.name,
        styleCode: product.product.styleCode,
        color: product.color,
        size: product.size,
        systemQuantity,
        physicalQuantity,
        difference,
      },
    ]);

    setBarcode("");
    setProduct(null);
    setPhysicalQuantity(0);
    setTimeout(() => {
      barcodeRef.current?.focus();
    }, 100);
  };

  // SAVE

  const handleSave = () => {
    if (!locationId) {
      alert("Select location");
      return;
    }

    if (!items.length) {
      alert("Add products");
      return;
    }

    createAdjustment.mutate(
      {
        adjustmentNo: `ADJ-${Date.now()}`,
        locationId,
        items: items.map((item) => ({
          productVariantId: item.productVariantId,
          systemQuantity: item.systemQuantity,
          physicalQuantity: item.physicalQuantity,
        })),
      },
      {
        onSuccess: (adjustment) => {
          navigate(`/stock-adjustments/${adjustment.id}`);
        },
      },
    );
  };

  return (
    <div className="space-y-4">
      {/* HEADER */}

      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h1 className="text-2xl font-bold">Stock Adjustment</h1>
      </div>

      {/* BODY */}

      <div className="grid grid-cols-12 gap-4">
        {/* LEFT */}

        <Card className="col-span-12 lg:col-span-3">
          <CardContent className="space-y-4 p-4">
            {/* Location */}

            <div>
              <label className="mb-1 block text-sm font-medium">Location</label>

              <select
                className="w-full rounded-md border p-2"
                value={locationId}
                onChange={(e) => setLocationId(e.target.value)}
              >
                <option value="">Select Location</option>

                {locations?.map((location: any) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
                  </option>
                ))}
              </select>
            </div>

            {/* BARCODE */}

            <div>
              <label className="mb-1 block text-sm font-medium">Barcode</label>

              <Input
                ref={barcodeRef}
                value={barcode}
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
                readOnly
                value={
                  product
                    ? `${product.product.name} (${product.color} / ${product.size})`
                    : ""
                }
              />
            </div>

            {/* SYSTEM STOCK */}

            <div>
              <label className="mb-1 block text-sm font-medium">
                System Stock
              </label>

              <Input readOnly value={product?.stocks?.[0]?.quantity || 0} />
            </div>

            {/* PHYSICAL */}

            <div>
              <label className="mb-1 block text-sm font-medium">
                Physical Stock
              </label>

              <Input
                type="number"
                value={physicalQuantity}
                onChange={(e) => setPhysicalQuantity(Number(e.target.value))}
              />
            </div>

            {/* ACTIONS */}

            <div className="flex gap-2 pt-4">
              <Button onClick={handleAddItem}>Add</Button>

              <Button variant="secondary" onClick={handleSave}>
                Save
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT */}

        <Card className="col-span-12 lg:col-span-9">
          <CardContent className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-slate-100">
                    <th className="p-3">Barcode</th>

                    <th className="p-3">Product</th>

                    <th className="p-3">System</th>

                    <th className="p-3">Physical</th>

                    <th className="p-3">Difference</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{item.barcode}</td>

                      <td className="p-3">{item.productName}</td>

                      <td className="p-3">{item.systemQuantity}</td>

                      <td className="p-3">{item.physicalQuantity}</td>

                      <td className="p-3 font-semibold">{item.difference}</td>
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
