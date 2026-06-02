import { useParams } from "react-router-dom";

import { usePurchaseReturn } from "../hooks/usePurchaseReturn";

export default function PurchaseReturnDetailsPage() {
  const { id } = useParams();

  const { data, isLoading } = usePurchaseReturn(id);

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Purchase Return</h1>

            <p className="text-slate-500">{data.returnNo}</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-slate-500">Date</p>

            <p className="font-medium">
              {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      {/* INFO */}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Supplier</h2>

          <p className="font-medium">{data.supplier?.name}</p>

          <p className="text-sm text-slate-500">{data.supplier?.phone}</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Purchase</h2>

          <p className="font-medium">{data.purchase?.invoiceNo}</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Amount</h2>

          <p className="text-2xl font-bold">৳{data.totalAmount}</p>
        </div>
      </div>

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

                <th className="p-3">Cost</th>

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

                  <td className="p-3">৳{item.costPrice}</td>

                  <td className="p-3">৳{item.totalPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
