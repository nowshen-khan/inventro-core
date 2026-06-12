import { useParams } from "react-router-dom";
import { usePurchase } from "../hooks/usePurchase";

export default function PurchaseDetailsPage() {
  const { id } = useParams();

  const { data, isLoading } = usePurchase(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Purchase not found</div>;
  }

  const due = data.totalAmount - data.paidAmount;

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Purchase Invoice</h1>

            <p className="text-slate-500">{data.invoiceNo}</p>
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
          <h2 className="mb-4 text-lg font-semibold">Location</h2>

          <p className="font-medium">{data.location?.name}</p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Payment</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Total</span>

              <span>৳{data.totalAmount}</span>
            </div>

            <div className="flex justify-between">
              <span>Paid</span>

              <span>৳{data.paidAmount}</span>
            </div>

            <div className="flex justify-between font-semibold text-red-500">
              <span>Due</span>

              <span>৳{due}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ITEMS */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold">Items</h2>

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
