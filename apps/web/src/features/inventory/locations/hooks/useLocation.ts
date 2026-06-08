import { useQuery } from "@tanstack/react-query";
import { getLocation } from "../api/locations.api";

export const useLocation = (id: string) =>
  useQuery({
    queryKey: ["location", id],
    queryFn: () => getLocation(id),
    enabled: !!id,
  });
