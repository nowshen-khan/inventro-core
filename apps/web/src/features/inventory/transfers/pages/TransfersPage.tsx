import { useMemo, useState } from "react";
import { Download, Eye, FileText, Printer } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { ColumnDef } from "@tanstack/react-table";
import type { TransferStatus } from "@repo/types/enums";
import type { Transfer, TransferFilters } from "@repo/types/transfers";
import { DataTable } from "@/shared/components/DataTable";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { useLocations } from "@/features/inventory/locations/hooks/useLocations";
import { exportTransfersExcel } from "../api/transfers.api";
import { useUpdateTransferStatus } from "../hooks/useApproveTransfer";
import { useTransferReport } from "../hooks/useTransferReport";
import { useTransfers } from "../hooks/useTransfers";

const TRANSFER_STATUSES: TransferStatus[] = [
  "DRAFT",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "COMPLETED",
  "CANCELLED",
];

const STATUS_ACTIONS: Partial<Record<TransferStatus, TransferStatus[]>> = {
  DRAFT: ["PENDING", "CANCELLED"],
  PENDING: ["APPROVED", "REJECTED", "CANCELLED"],
  APPROVED: ["COMPLETED", "CANCELLED"],
};

const statusClass: Record<TransferStatus, string> = {
  DRAFT: "bg-slate-100 text-slate-700",
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-blue-100 text-blue-800",
  REJECTED: "bg-rose-100 text-rose-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELLED: "bg-zinc-200 text-zinc-700",
};

const getOverdueLabel = (transfer: Transfer) => {
  const ageMs = Date.now() - new Date(transfer.createdAt).getTime();
  const dayMs = 24 * 60 * 60 * 1000;

  if (transfer.status === "DRAFT" && ageMs > 7 * dayMs) {
    return "Stale Draft";
  }

  if (transfer.status === "PENDING" && ageMs > 3 * dayMs) {
    return "Overdue";
  }

  return "";
};

export default function TransfersPage() {
  const navigate = useNavigate();
  const updateStatus = useUpdateTransferStatus();
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [filters, setFilters] = useState<TransferFilters>({
    search: "",
    status: "",
    sourceLocationId: "",
    destLocationId: "",
    dateFrom: "",
    dateTo: "",
  });

  const queryFilters = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(filters).filter(([, value]) => Boolean(value)),
      ) as TransferFilters,
    [filters],
  );

  const { data: transfers, isLoading } = useTransfers(queryFilters);
  const { data: report } = useTransferReport(queryFilters);
  const { data: locationsData } = useLocations();
  const locations = Array.isArray(locationsData)
    ? locationsData
    : locationsData?.items || [];

  const handleFilterChange = (key: keyof TransferFilters, value: string) => {
    setPagination((current) => ({ ...current, pageIndex: 0 }));
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const handleExport = async () => {
    const blob = await exportTransfersExcel(queryFilters);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "transfers.xlsx";
    link.click();
    window.URL.revokeObjectURL(url);
  };

  const columns = useMemo<ColumnDef<Transfer>[]>(
    () => [
      {
        accessorKey: "transferNo",
        header: "Transfer No",
      },
      {
        accessorKey: "sourceLocation.name",
        header: "From",
      },
      {
        accessorKey: "destLocation.name",
        header: "To",
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) =>
          new Date(row.original.createdAt).toLocaleDateString(),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const overdueLabel = getOverdueLabel(row.original);

          return (
            <div className="flex flex-wrap gap-2">
              <span
                className={`rounded px-2 py-1 text-xs font-medium ${
                  statusClass[row.original.status]
                }`}
              >
                {row.original.status}
              </span>
              {overdueLabel ? (
                <span className="rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700">
                  {overdueLabel}
                </span>
              ) : null}
            </div>
          );
        },
      },
      {
        accessorKey: "requestedBy",
        header: "Requested By",
        cell: ({ row }) => row.original.requestedBy || "-",
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
          const actions = STATUS_ACTIONS[row.original.status] || [];

          return (
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                variant="outline"
                title="View transfer"
                onClick={() => navigate(`/transfers/${row.original.id}`)}
              >
                <Eye size={16} />
              </Button>

              <Button
                size="sm"
                variant="outline"
                title="Print transfer"
                onClick={() => navigate(`/transfers/${row.original.id}`)}
              >
                <Printer size={16} />
              </Button>

              {actions.map((status) => (
                <Button
                  key={status}
                  size="sm"
                  variant={status === "REJECTED" ? "destructive" : "secondary"}
                  disabled={updateStatus.isPending}
                  onClick={() =>
                    updateStatus.mutate({ id: row.original.id, status })
                  }
                >
                  {status}
                </Button>
              ))}
            </div>
          );
        },
      },
    ],
    [navigate, updateStatus],
  );

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Stock Transfers</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button variant="outline" onClick={handleExport}>
              <Download size={16} />
              Export Excel
            </Button>
            <Button onClick={() => navigate("/transfers/new")}>
              New Transfer
            </Button>
          </div>
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          <Input
            placeholder="Search transfer"
            value={filters.search}
            onChange={(event) =>
              handleFilterChange("search", event.target.value)
            }
          />

          <select
            className="rounded-md border px-3 py-2 text-sm"
            value={filters.status}
            onChange={(event) =>
              handleFilterChange("status", event.target.value)
            }
          >
            <option value="">All Status</option>
            {TRANSFER_STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <select
            className="rounded-md border px-3 py-2 text-sm"
            value={filters.sourceLocationId}
            onChange={(event) =>
              handleFilterChange("sourceLocationId", event.target.value)
            }
          >
            <option value="">All Source</option>
            {locations.map((location: any) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>

          <select
            className="rounded-md border px-3 py-2 text-sm"
            value={filters.destLocationId}
            onChange={(event) =>
              handleFilterChange("destLocationId", event.target.value)
            }
          >
            <option value="">All Destination</option>
            {locations.map((location: any) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>

          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(event) =>
              handleFilterChange("dateFrom", event.target.value)
            }
          />

          <Input
            type="date"
            value={filters.dateTo}
            onChange={(event) =>
              handleFilterChange("dateTo", event.target.value)
            }
          />
        </div>

        <div className="mb-6 grid gap-3 md:grid-cols-3 lg:grid-cols-6">
          <div className="rounded border p-3">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <FileText size={16} />
              Draft Transfers
            </div>
            <p className="mt-1 text-xl font-semibold">
              {report?.draftTransfers ?? 0}
            </p>
          </div>

          <div className="rounded border p-3">
            <p className="text-sm text-slate-500">Pending Approval</p>
            <p className="mt-1 text-xl font-semibold">
              {report?.pendingApproval ?? 0}
            </p>
          </div>

          <div className="rounded border border-red-200 p-3">
            <p className="text-sm text-red-600">Overdue Transfers</p>
            <p className="mt-1 text-xl font-semibold text-red-700">
              {report?.overdueTransfers ?? 0}
            </p>
          </div>

          <div className="rounded border p-3">
            <p className="text-sm text-slate-500">Reserved Qty</p>
            <p className="mt-1 text-xl font-semibold">
              {report?.reservedQuantity ?? 0}
            </p>
          </div>

          {TRANSFER_STATUSES.slice(2, 5).map((status) => (
            <div key={status} className="rounded border p-3">
              <p className="text-sm text-slate-500">{status}</p>
              <p className="mt-1 text-xl font-semibold">
                {report?.byStatus?.[status] ?? 0}
              </p>
            </div>
          ))}
        </div>

        {isLoading ? (
          <div>Loading ....</div>
        ) : (
          <DataTable
            columns={columns}
            data={transfers || []}
            pagination={pagination}
            pageCount={1}
            onPaginationChange={setPagination}
          />
        )}
      </div>
    </div>
  );
}
