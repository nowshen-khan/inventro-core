import api from "@/shared/api/client.api";

export const getMyPermissions = () =>
  api.get<string[]>("/auth/permissions").then((res) => res.data);
