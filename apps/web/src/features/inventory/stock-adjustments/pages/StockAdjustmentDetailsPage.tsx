import { useParams } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { useStockAdjustment } from "../hooks/useStockAdjustment";

export default function StockAdjustmentDetailsPage() {
  const { id } = useParams();

  const { data, isLoading } = useStockAdjustment(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Adjustment not found</div>;
  }

  const totalDifference = data.items.reduce(
    (sum: number, item: any) => sum + Number(item.difference),
    0,
  );

  return (
    <div className="space-y-6">
      {/* ACTIONS */}

      <div className="flex justify-end">
        <Button onClick={() => window.print()}>Print</Button>
      </div>

      {/* DOCUMENT */}

      <div className="rounded-2xl bg-white p-8 shadow-sm print:shadow-none">
        {/* HEADER */}

        <div className="border-b pb-6 text-center">
          <h1 className="text-3xl font-bold uppercase">Stock Adjustment</h1>

          <p className="mt-2 text-slate-500">Inventory Reconciliation</p>
        </div>

        {/* INFO */}

        <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Adjustment No:</span>{" "}
              {data.adjustmentNo}
            </p>

            <p>
              <span className="font-semibold">Location:</span>{" "}
              {data.location?.name}
            </p>
          </div>

          <div className="space-y-2 text-right">
            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(data.createdAt).toLocaleDateString()}
            </p>

            <p>
              <span className="font-semibold">Total Items:</span>{" "}
              {data.items?.length}
            </p>
          </div>
        </div>

        {/* NOTE */}

        {data.note && (
          <div className="mt-6 rounded-xl border p-4">
            <h2 className="mb-2 font-semibold">Note</h2>

            <p className="text-sm text-slate-600">{data.note}</p>
          </div>
        )}

        {/* TABLE */}

        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border p-3">Barcode</th>

                <th className="border p-3">Product</th>

                <th className="border p-3">Variant</th>

                <th className="border p-3">System</th>

                <th className="border p-3">Physical</th>

                <th className="border p-3">Difference</th>
              </tr>
            </thead>

            <tbody>
              {data.items.map((item: any) => (
                <tr key={item.id}>
                  <td className="border p-3">{item.variant?.barcode}</td>

                  <td className="border p-3">{item.variant?.product?.name}</td>

                  <td className="border p-3">
                    {item.variant?.color}
                    {" / "}
                    {item.variant?.size}
                  </td>

                  <td className="border p-3 text-center">
                    {item.systemQuantity}
                  </td>

                  <td className="border p-3 text-center">
                    {item.physicalQuantity}
                  </td>

                  <td className="border p-3 text-center font-semibold">
                    {item.difference}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="bg-slate-100 font-bold">
                <td colSpan={5} className="border p-3 text-right">
                  Net Difference
                </td>

                <td className="border p-3 text-center">{totalDifference}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* SIGNATURE */}

        <div className="mt-20 grid grid-cols-3 gap-10 text-center text-sm">
          <div>
            <div className="border-t pt-2">Prepared By</div>
          </div>

          <div>
            <div className="border-t pt-2">Checked By</div>
          </div>

          <div>
            <div className="border-t pt-2">Approved By</div>
          </div>
        </div>
      </div>
    </div>
  );
}
