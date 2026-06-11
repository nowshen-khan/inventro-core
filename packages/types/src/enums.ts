export const MovementType = {
  PURCHASE: "PURCHASE",
  SALE: "SALE",
  TRANSFER_IN: "TRANSFER_IN",
  TRANSFER_OUT: "TRANSFER_OUT",
  ADJUSTMENT: "ADJUSTMENT",
  RETURN: "RETURN",
  DAMAGE: "DAMAGE",
} as const;

export type MovementType = (typeof MovementType)[keyof typeof MovementType];

export const PaymentMethod = {
  CASH: "CASH",
  CARD: "CARD",
  BANK_TRANSFER: "BANK_TRANSFER",
  MOBILE_BANKING: "MOBILE_BANKING",
} as const;

export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const TransferStatus = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};

export type TransferStatus =
  (typeof TransferStatus)[keyof typeof TransferStatus];

export const SaleStatus = {
  DRAFT: "DRAFT",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  RETURNED: "RETURNED",
};

export type SaleStatus = (typeof SaleStatus)[keyof typeof SaleStatus];

export const PurchaseStatus = {
  DRAFT: "DRAFT",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  RETURNED: "RETURNED",
};

export type PurchaseStatus =
  (typeof PurchaseStatus)[keyof typeof PurchaseStatus];
