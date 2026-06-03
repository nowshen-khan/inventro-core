import { create } from "zustand";
import { loginApi, logoutApi, getMe } from "@/features/auth/api/auth.api";

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
      await loginApi(email, password);
      const user = await getMe();
      set({ user, isInitialized: true });
    } catch (error) {
      set({ user: null, isInitialized: true });
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    try {
      await logoutApi();
    } catch {
    } finally {
      set({ user: null, isInitialized: true });
    }
  },

  fetchUser: async () => {
    const state = useAuthStore.getState();

    if (state.isLoading) {
      return;
    }

    try {
      set({ isLoading: true });
      const user = await getMe();
      set({ user, isInitialized: true });
    } catch {
      set({ user: null, isInitialized: true });
    } finally {
      set({ isLoading: false });
    }
  },
}));
