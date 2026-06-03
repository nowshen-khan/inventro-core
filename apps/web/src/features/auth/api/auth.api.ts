import api from "@/shared/api/client.api";
import type { User } from "@repo/types/user";

interface LoginResponse {
  user: User;
}
export const loginApi = async (
  email: string,
  password: string,
): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/auth/login", {
    email,
    password,
  });

  return res.data;
};

export const logoutApi = async (): Promise<void> => {
  await api.post("/auth/logout");
};

export const getMe = async (): Promise<User> => {
  const res = await api.get<{ user: User }>("/auth/me");

  return res.data.user;
};

export const getMyPermissions = async (): Promise<string[]> => {
  const res = await api.get<string[]>("/auth/permissions");

  return res.data;
};
