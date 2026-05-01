import { api } from "@/services/api";
import { User } from "@/types";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: false,

  loadStoredAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      const userStr = await SecureStore.getItemAsync("auth_user");
      if (token && userStr) {
        set({ token, user: JSON.parse(userStr) });
      }
    } catch {}
  },

  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/api/v1/users/login", { email, password });
      const { accessToken, user } = res.data.data;
      await SecureStore.setItemAsync("auth_token", accessToken);
      await SecureStore.setItemAsync("auth_user", JSON.stringify(user));
      set({ token: accessToken, user });
    } finally {
      set({ isLoading: false });
    }
  },

  register: async (username, email, password) => {
    set({ isLoading: true });
    try {
      const res = await api.post("/api/v1/users/register", {
        username,
        email,
        password,
      });
      const { accessToken, user } = res.data.data;
      await SecureStore.setItemAsync("auth_token", accessToken);
      await SecureStore.setItemAsync("auth_user", JSON.stringify(user));
      set({ token: accessToken, user });
    } finally {
      set({ isLoading: false });
    }
  },

  logout: async () => {
    await SecureStore.deleteItemAsync("auth_token");
    await SecureStore.deleteItemAsync("auth_user");
    set({ user: null, token: null });
  },
}));
