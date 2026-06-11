import type { Location } from "./location";
import type { ProductVariant } from "./product";
import type { TransferStatus } from "./enums";
import type { User } from "./user";

export interface Transfer {
  id: string;
  transferNo: string;
  sourceLocationId: string;
  sourceLocation?: Location;
  destLocationId: string;
  destLocation?: Location;
  items: TransferItem[];
  status: TransferStatus;
  note?: string | null;
  requestedById?: string | null;
  approvedById?: string | null;

  requestedBy?: User;
  approvedBy?: User;
  createdAt: string;
  updatedAt: string;
}

export interface TransferItem {
  id: string;
  transferId: string;
  productVariantId: string;
  variant?: ProductVariant;
  quantity: number;
}

export interface CreateTransferPayload {
  transferNo?: string;
  sourceLocationId: string;
  destLocationId: string;
  status?: "DRAFT" | "PENDING";
  note?: string;
  items: { productVariantId: string; quantity: number }[];
}

export interface TransferFilters {
  search?: string;
  status?: TransferStatus | "";
  sourceLocationId?: string;
  destLocationId?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface TransferReport {
  totalTransfers: number;
  totalQuantity: number;
  reservedQuantity: number;
  draftTransfers: number;
  pendingApproval: number;
  overdueTransfers: number;
  byStatus: Record<TransferStatus, number>;
}

export interface TransferAuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string | null;
  oldValue?: unknown;
  newValue?: unknown;
  userId: string;
  createdAt: string;
}
