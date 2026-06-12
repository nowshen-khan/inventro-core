import { useState, useEffect, useRef } from "react";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Card, CardContent } from "@/shared/components/ui/card";
import { posSearchProducts } from "@/features/catalog/products/api/products.api";
import { useCreateTransfer } from "@/features/inventory/transfers/hooks/useCreateTransfer";
import { useLocations } from "@/features/inventory/locations/hooks/useLocations";
import { useNavigate } from "react-router-dom";

export default function TransferFormPage() {
  const [items, setItems] = useState<any[]>([]);

  const [barcode, setBarcode] = useState("");

  const barcodeRef = useRef<HTMLInputElement>(null);
  const barcodeRequestId = useRef(0);
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);

  const navigate = useNavigate();

  const createTransfer = useCreateTransfer();

  const { data: locations } = useLocations();
  const locationList = Array.isArray(locations)
    ? locations
    : locations?.items || [];

  const [sourceLocationId, setSourceLocationId] = useState("");

  const [destLocationId, setDestLocationId] = useState("");

  const [note, setNote] = useState("");
  const [isBarcodeLoading, setIsBarcodeLoading] = useState(false);

  const saveTransfer = (status: "DRAFT" | "PENDING") => {
    if (!items.length) return;

    if (sourceLocationId === destLocationId) {
      alert("Source and destination location cannot be same");

      return;
    }

    if (!sourceLocationId || !destLocationId) {
      alert("Select locations");

      return;
    }

    createTransfer.mutate(
      {
        sourceLocationId,

        destLocationId,

        status,

        note,

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
  };

  const getAvailableStock = (variant: any) => {
    const sourceStock = variant?.stocks?.find(
      (stock: any) => stock.locationId === sourceLocationId,
    );

    return Number(sourceStock?.quantity || 0) -
      Number(sourceStock?.reservedQuantity || 0);
  };

  useEffect(() => {
    const requestId = ++barcodeRequestId.current;

    const fetchProduct = async () => {
      if (!barcode || barcode.length < 3) return;

      try {
        const data = await posSearchProducts(barcode);

        if (requestId === barcodeRequestId.current && data?.length) {
          setProduct(data[0]);
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchProduct();
  }, [barcode]);

  const addProductToTransfer = (selectedProduct: any, addQuantity: number) => {
    const currentStock = getAvailableStock(selectedProduct);

    if (addQuantity <= 0) {
      alert("Invalid quantity");
      return;
    }

    if (addQuantity > currentStock) {
      alert("Insufficient available stock");
      return;
    }

    const existing = items.find(
      (item: any) => item.productVariantId === selectedProduct.id,
    );

    if (existing) {
      const updatedQty = existing.quantity + addQuantity;

      if (updatedQty > currentStock) {
        alert("Available stock exceeded");
        return;
      }

      setItems(
        items.map((item: any) =>
          item.productVariantId === selectedProduct.id
            ? {
                ...item,
                quantity: updatedQty,
                availableQuantity: currentStock,
              }
            : item,
        ),
      );
    } else {
      setItems([
        ...items,
        {
          productVariantId: selectedProduct.id,
          barcode: selectedProduct.barcode,
          productName: selectedProduct.product.name,
          styleCode: selectedProduct.product.styleCode,
          color: selectedProduct.color,
          size: selectedProduct.size,
          quantity: addQuantity,
          availableQuantity: currentStock,
        },
      ]);
    }

    setBarcode("");
    setProduct(null);
    setQuantity(1);
    barcodeRequestId.current += 1;

    setTimeout(() => {
      barcodeRef.current?.focus();
    }, 100);
  };

  const handleAddItem = () => {
    if (!product) return;

    addProductToTransfer(product, quantity);
  };

  const handleBarcodeEnter = async () => {
    if (!barcode.trim()) return;

    if (!sourceLocationId) {
      alert("Select source location first");
      return;
    }

    setIsBarcodeLoading(true);

    try {
      const products = await posSearchProducts(barcode.trim());

      if (!products?.length) {
        alert("Product not found");
        return;
      }

      addProductToTransfer(products[0], quantity || 1);
    } catch (error) {
      console.error(error);
      alert("Product search failed");
    } finally {
      setIsBarcodeLoading(false);
    }
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
                From Location
              </label>

              <select
                className="w-full rounded-md border p-2"
                value={sourceLocationId}
                onChange={(e) => {
                  setSourceLocationId(e.target.value);
                  setItems([]);
                  setBarcode("");
                  setProduct(null);
                  setQuantity(1);
                  barcodeRequestId.current += 1;
                }}
              >
                <option value="">Select Location</option>

                {locationList.map((location: any) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
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
                value={destLocationId}
                onChange={(e) => setDestLocationId(e.target.value)}
              >
                <option value="">Select Location</option>

                {locationList.map((location: any) => (
                  <option key={location.id} value={location.id}>
                    {location.name}
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
                onChange={(e) => {
                  setBarcode(e.target.value);
                  barcodeRequestId.current += 1;
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();

                    handleBarcodeEnter();
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

              <Input readOnly value={product ? getAvailableStock(product) : 0} />
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

            <div>
              <label className="mb-1 block text-sm font-medium">Note</label>

              <textarea
                className="w-full rounded-md border p-2"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>

            {/* ACTIONS */}

            <div className="flex flex-wrap gap-2 pt-4">
              <Button onClick={handleAddItem} disabled={isBarcodeLoading}>
                Add
              </Button>

              <Button variant="outline" onClick={() => saveTransfer("DRAFT")}>
                Save Draft
              </Button>

              <Button
                variant="secondary"
                onClick={() => saveTransfer("PENDING")}
              >
                Submit
              </Button>

              <Button
                variant="destructive"
                onClick={() => {
                  setItems([]);
    setBarcode("");
    setProduct(null);
    setQuantity(1);
    barcodeRequestId.current += 1;
                  setNote("");
                }}
              >
                Reset
              </Button>
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

                    <th className="p-3 text-left">Available</th>

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

                      <td className="p-3">{item.availableQuantity}</td>

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
