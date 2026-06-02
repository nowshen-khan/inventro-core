import type { Branch } from "./branch";

export interface Warehouse {
  id: string;
  name: string;
  code: string;
  branchId: string;
  branch?: Branch;
}
