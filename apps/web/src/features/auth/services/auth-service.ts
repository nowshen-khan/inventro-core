import { api } from "@/shared/lib/axios";

export const loginRequest = async (email: string, password: string) => {
  const res = await api.post("/auth/login", {
    email,
    password,
  });

  return res.data;
};

export const meRequest = async () => {
  const res = await api.get("/auth/me");

  return res.data;
};
