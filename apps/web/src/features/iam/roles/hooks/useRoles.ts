import { useQuery } from "@tanstack/react-query";
import { getRoles } from "../api/roles.api";

export const useRoles = () =>
  useQuery({ queryKey: ["roles"], queryFn: () => getRoles() });
