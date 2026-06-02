import type { Branch } from "./branch";

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  branchId?: string;
  branch?: Branch;
}
