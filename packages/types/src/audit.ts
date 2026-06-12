export interface AuditLog {
  id: string;
  action: string;
  entity: string;
  entityId?: string | null;
  oldValue?: unknown;
  newValue?: unknown;
  userId: string;
  createdAt: string;
}
