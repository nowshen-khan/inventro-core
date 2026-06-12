import { useParams, Link } from "react-router-dom";
import { Button } from "@/shared/components/ui/button";
import { useProduct } from "../hooks/useProduct";
import { useProductAuditLogs } from "../hooks/useProductAuditLogs";

export default function ProductAuditLogsPage() {
  const { id } = useParams();
  const { data: product, isLoading } = useProduct(id);
  const { data: logs, isLoading: logsLoading } = useProductAuditLogs(id);

  if (isLoading || logsLoading) {
    return <div>Loading...</div>;
  }

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Product Audit Log</h1>
          <p className="text-sm text-slate-500">
            {product.name} - {product.styleCode}
          </p>
        </div>

        <Link to={`/products/${product.id}/edit`}>
          <Button variant="outline">Back to Product</Button>
        </Link>
      </div>

      <div className="space-y-3 rounded-2xl bg-white p-6 shadow-sm">
        {logs?.length ? (
          logs.map((log) => (
            <div key={log.id} className="rounded-lg border p-4 text-sm">
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:justify-between">
                <span className="font-semibold">{log.action}</span>
                <span className="text-slate-500">
                  {new Date(log.createdAt).toLocaleString()}
                </span>
              </div>
              <div className="mt-2 grid gap-3 md:grid-cols-2">
                <pre className="overflow-x-auto rounded bg-slate-50 p-3 text-xs">
                  {JSON.stringify(log.oldValue, null, 2)}
                </pre>
                <pre className="overflow-x-auto rounded bg-slate-50 p-3 text-xs">
                  {JSON.stringify(log.newValue, null, 2)}
                </pre>
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">No audit logs found.</p>
        )}
      </div>
    </div>
  );
}
