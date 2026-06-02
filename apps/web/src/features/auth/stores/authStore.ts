import { create } from "zustand";
import api from "@/shared/api/client.api";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;

  isInitialized: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: false,
  isInitialized: false,

  login: async (email, password) => {
    set({ isLoading: true });

    try {
      await api.post("/auth/login", { email, password });

      const userRes = await api.get("/auth/me");

      set({ user: userRes.data.user, isInitialized: true });
    } catch (error) {
      set({ user: null, isInitialized: true });

      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch {
    } finally {
      set({ user: null, isInitialized: true });
    }
  },
  fetchUser: async () => {
    try {
      const res = await api.get("/auth/me");
      set({ user: res.data.user, isInitialized: true });
    } catch {
      set({ user: null, isInitialized: true });
    }
  },
}));
