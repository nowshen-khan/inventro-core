import { useParams } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { useTransfer } from "../hooks/useTransfer";

export default function TransferDetailsPage() {
  const { id } = useParams();

  const { data, isLoading } = useTransfer(id);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!data) {
    return <div>Transfer not found</div>;
  }

  const totalQty = data.items.reduce(
    (sum: number, item: any) => sum + Number(item.quantity),
    0,
  );

  return (
    <div className="space-y-6">
      {/* ACTIONS */}

      <div className="flex justify-end">
        <Button onClick={() => window.print()}>Print Challan</Button>
      </div>

      {/* CHALLAN */}

      <div className="bg-white p-8 shadow-sm print:shadow-none">
        {/* HEADER */}

        <div className="border-b pb-6 text-center">
          <h1 className="text-3xl font-bold uppercase">
            Store Transfer Challan
          </h1>

          <p className="mt-2 text-slate-500">Warehouse Transfer Document</p>
        </div>

        {/* INFO */}

        <div className="mt-6 grid grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <p>
              <span className="font-semibold">Transfer No:</span>{" "}
              {data.transferNo}
            </p>

            <p>
              <span className="font-semibold">Status:</span> {data.status}
            </p>

            <p>
              <span className="font-semibold">Date:</span>{" "}
              {new Date(data.createdAt).toLocaleDateString()}
            </p>
          </div>

          <div className="space-y-2 text-right">
            <p>
              <span className="font-semibold">From:</span>{" "}
              {data.sourceWarehouse?.name}
            </p>

            <p>
              <span className="font-semibold">To:</span>{" "}
              {data.destWarehouse?.name}
            </p>
          </div>
        </div>

        {/* TABLE */}

        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse border text-sm">
            <thead>
              <tr className="bg-slate-100">
                <th className="border p-3">SL</th>

                <th className="border p-3">Barcode</th>

                <th className="border p-3">Style Code</th>

                <th className="border p-3">Product</th>

                <th className="border p-3">Color</th>

                <th className="border p-3">Size</th>

                <th className="border p-3">Qty</th>
              </tr>
            </thead>

            <tbody>
              {data.items.map((item: any, index: number) => (
                <tr key={item.id}>
                  <td className="border p-3 text-center">{index + 1}</td>

                  <td className="border p-3">{item.variant?.barcode}</td>

                  <td className="border p-3">
                    {item.variant?.product?.styleCode}
                  </td>

                  <td className="border p-3">{item.variant?.product?.name}</td>

                  <td className="border p-3">{item.variant?.color}</td>

                  <td className="border p-3">{item.variant?.size}</td>

                  <td className="border p-3 text-center font-medium">
                    {item.quantity}
                  </td>
                </tr>
              ))}
            </tbody>

            <tfoot>
              <tr className="bg-slate-100 font-bold">
                <td colSpan={6} className="border p-3 text-right">
                  Total Qty
                </td>

                <td className="border p-3 text-center">{totalQty}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* SIGNATURES */}

        <div className="mt-20 grid grid-cols-4 gap-10 text-center text-sm">
          <div>
            <div className="border-t pt-2">Prepared By</div>
          </div>

          <div>
            <div className="border-t pt-2">Checked By</div>
          </div>

          <div>
            <div className="border-t pt-2">Received By</div>
          </div>

          <div>
            <div className="border-t pt-2">Authorized By</div>
          </div>
        </div>
      </div>
    </div>
  );
}
