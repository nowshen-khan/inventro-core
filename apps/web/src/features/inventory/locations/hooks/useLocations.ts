import { useQuery } from "@tanstack/react-query";
import { getLocations } from "../api/locations.api";
import type { LocationFilters } from "@repo/types/location";

export const useLocations = (params?: LocationFilters) =>
  useQuery({
    queryKey: ["locations", params],
    queryFn: () => getLocations(params),
  });
