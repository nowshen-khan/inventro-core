import type { Location } from "./location";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  locationId?: string;
  location?: Location;
}
