import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { useSale } from "../hooks/useSale";

export default function SaleDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useSale(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Sale not found</div>;
  }

  const due = Number(data.totalAmount) - Number(data.paidAmount);

  return (
    <div className="space-y-6">
      {/* HEADER */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Sales Invoice</h1>

            <p className="text-slate-500">{data.invoiceNo}</p>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => window.print()}>
              Print
            </Button>
            <Button
              onClick={() => navigate(`/sale-returns/new?saleId=${data.id}`)}
            >
              {" "}
              Return{" "}
            </Button>
            <Button
              variant="secondary"
              onClick={() =>
                navigate(`/product-exchanges/new?saleId=${data.id}`)
              }
            >
              Exchange
            </Button>
          </div>
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
          <h2 className="mb-4 text-lg font-semibold">Payment</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Method</span>

              <span>{data.paymentMethod}</span>
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

        <div className="rounded-2xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Summary</h2>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>

              <span>৳{data.subtotal}</span>
            </div>

            <div className="flex justify-between">
              <span>Discount</span>

              <span>৳{data.discount}</span>
            </div>

            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>

              <span>৳{data.totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* ITEMS */}

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold">Sold Items</h2>

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
