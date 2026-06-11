import { Download, Printer } from "lucide-react";
import { useParams } from "react-router-dom";
import type { TransferStatus } from "@repo/types/enums";
import { Button } from "@/shared/components/ui/button";
import { useUpdateTransferStatus } from "../hooks/useApproveTransfer";
import { useTransfer } from "../hooks/useTransfer";
import { useTransferAuditLogs } from "../hooks/useTransferAuditLogs";

const STATUS_ACTIONS: Partial<Record<TransferStatus, TransferStatus[]>> = {
  DRAFT: ["PENDING", "CANCELLED"],
  PENDING: ["APPROVED", "REJECTED", "CANCELLED"],
  APPROVED: ["COMPLETED", "CANCELLED"],
};

export default function TransferDetailsPage() {
  const { id } = useParams();
  const { data, isLoading } = useTransfer(id);
  const { data: auditLogs } = useTransferAuditLogs(id);
  const updateStatus = useUpdateTransferStatus();

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
  const actions = STATUS_ACTIONS[data.status] || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-end gap-2 print:hidden">
        {actions.map((status) => (
          <Button
            key={status}
            variant={status === "REJECTED" ? "destructive" : "secondary"}
            disabled={updateStatus.isPending}
            onClick={() => updateStatus.mutate({ id: data.id, status })}
          >
            {status}
          </Button>
        ))}

        <Button variant="outline" onClick={() => window.print()}>
          <Printer size={16} />
          Print
        </Button>

        <Button variant="outline" onClick={() => window.print()}>
          <Download size={16} />
          Export PDF
        </Button>
      </div>

      <div className="bg-white p-8 shadow-sm print:shadow-none">
        <div className="border-b pb-6 text-center">
          <h1 className="text-3xl font-bold uppercase">
            Store Transfer Challan
          </h1>

          <p className="mt-2 text-slate-500">Location Transfer Document</p>
        </div>

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
              {data.sourceLocation?.name}
            </p>

            <p>
              <span className="font-semibold">To:</span>{" "}
              {data.destLocation?.name}
            </p>
          </div>
        </div>

        {data.note ? (
          <div className="mt-6 rounded border p-3 text-sm">
            <span className="font-semibold">Note:</span> {data.note}
          </div>
        ) : null}

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

      <div className="rounded-lg bg-white p-6 shadow-sm print:hidden">
        <h2 className="mb-4 text-lg font-semibold">Audit Log</h2>
        <div className="space-y-3">
          {auditLogs?.length ? (
            auditLogs.map((log) => (
              <div key={log.id} className="rounded border p-3 text-sm">
                <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                  <span className="font-medium">{log.action}</span>
                  <span className="text-slate-500">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
                <pre className="mt-2 overflow-x-auto rounded bg-slate-50 p-2 text-xs">
                  {JSON.stringify(log.newValue, null, 2)}
                </pre>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500">No audit logs found</p>
          )}
        </div>
      </div>
    </div>
  );
}
