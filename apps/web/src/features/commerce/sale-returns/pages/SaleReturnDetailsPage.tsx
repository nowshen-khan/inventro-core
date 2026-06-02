import { useParams } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { useSaleReturn } from "../hooks/useSaleReturn";

export default function SaleReturnDetailsPage() {
  const { id } = useParams();
  const { data, isLoading } = useSaleReturn(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Return not found</div>;
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sale Return Invoice</h1>

            <p className="text-slate-500">{data.returnNo}</p>
          </div>

          <Button variant="outline" onClick={() => window.print()}>
            Print
          </Button>
        </div>
      </div>

      {/* INFO */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Customer</h2>

          <p className="font-medium">
            {data.customer?.name || "Walk-in Customer"}
          </p>

          <p className="text-sm text-slate-500">{data.customer?.phone}</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Original Sale</h2>

          <p className="font-medium">{data.sale?.invoiceNo}</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Refund</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Refund Amount</span>

              <span>৳{data.refundAmount}</span>
            </div>

            <div className="flex justify-between font-semibold text-lg">
              <span>Total Return</span>

              <span>৳{data.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* NOTE */}

      {data.note && (
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-3 text-lg font-semibold">Note</h2>

          <p className="text-slate-600">{data.note}</p>
        </div>
      )}

      {/* ITEMS */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold">Returned Items</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left">
                <th className="p-3">Product</th>

                <th className="p-3">Variant</th>

                <th className="p-3">Qty</th>

                <th className="p-3">Price</th>

                <th className="p-3">Total</th>
              </tr>
            </thead>

            <tbody>
              {data.items.map((item: any) => (
                <tr key={item.id} className="border-b">
                  <td className="p-3">{item.variant?.product?.name}</td>

                  <td className="p-3">
                    {item.variant?.color}
                    {" / "}
                    {item.variant?.size}
                  </td>

                  <td className="p-3">{item.quantity}</td>

                  <td className="p-3">৳{item.sellingPrice}</td>

                  <td className="p-3 font-medium">৳{item.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
