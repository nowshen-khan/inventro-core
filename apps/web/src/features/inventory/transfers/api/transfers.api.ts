import api from "@/shared/api/client.api";
import type { TransferStatus } from "@repo/types/enums";
import type {
  CreateTransferPayload,
  Transfer,
  TransferAuditLog,
  TransferFilters,
  TransferReport,
} from "@repo/types/transfers";

export const getTransfers = (params?: TransferFilters) =>
  api.get<Transfer[]>("/transfers", { params }).then((res) => res.data);

export const getTransfer = (id: string) =>
  api.get<Transfer>(`/transfers/${id}`).then((res) => res.data);

export const createTransfer = (data: CreateTransferPayload) =>
  api.post("/transfers", data).then((res) => res.data);

export const approveTransfer = (id: string) =>
  api.put(`/transfers/${id}/approve`);

export const updateTransferStatus = (id: string, status: TransferStatus) => {
  const actionByStatus: Partial<Record<TransferStatus, string>> = {
    PENDING: "submit",
    APPROVED: "approve",
    REJECTED: "reject",
    COMPLETED: "complete",
    CANCELLED: "cancel",
  };
  const action = actionByStatus[status];

  if (!action) {
    throw new Error(`Unsupported transfer status action: ${status}`);
  }

  return api.put(`/transfers/${id}/${action}`);
};

export const getTransferReport = (params?: TransferFilters) =>
  api
    .get<TransferReport>("/transfers/report", { params })
    .then((res) => res.data);

export const getTransferAuditLogs = (id: string) =>
  api
    .get<TransferAuditLog[]>(`/transfers/${id}/audit-logs`)
    .then((res) => res.data);

export const exportTransfersExcel = (params?: TransferFilters) =>
  api
    .get<Blob>("/transfers/export", { params, responseType: "blob" })
    .then((res) => res.data);
