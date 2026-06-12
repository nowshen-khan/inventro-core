import type { ProductVariant } from "./product";
import type { Location } from "./location";

export interface Stock {
  id: string;
  productVariantId: string;
  locationId: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  variant?: ProductVariant;
  location?: Location;
}
