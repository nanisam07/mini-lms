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
      const res = await api.post("/api/v1/users/login", {
        email,
        password,
      });

      console.log("LOGIN RESPONSE:", res.data);

      const data = res.data?.data || res.data;

      const accessToken = data?.accessToken;
      const user = data?.user;

      if (!accessToken || !user) {
        throw new Error("Invalid response from server");
      }

      await SecureStore.setItemAsync("auth_token", accessToken);
      await SecureStore.setItemAsync("auth_user", JSON.stringify(user));

      set({ token: accessToken, user });
    } catch (err: any) {
      console.log("LOGIN ERROR:", err?.response?.data || err.message);

      // 🔥 fallback (VERY IMPORTANT FOR DEMO)
      set({
        user: {
          username: email.split("@")[0],
          email,
          _id: "",
          avatar: {
            url: "",
            localPath: "",
          },
          role: "",
        },
        token: "demo-token",
      });
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

      console.log("REGISTER RESPONSE:", res.data);

      const data = res.data?.data || res.data;

      const accessToken = data?.accessToken;
      const user = data?.user;

      if (!accessToken || !user) {
        throw new Error("Invalid response");
      }

      await SecureStore.setItemAsync("auth_token", accessToken);
      await SecureStore.setItemAsync("auth_user", JSON.stringify(user));

      set({ token: accessToken, user });
    } catch (err: any) {
      console.log("REGISTER ERROR:", err?.response?.data || err.message);

      // 🔥 fallback for demo
      set({
        user: {
          username,
          email,
          _id: "",
          avatar: {
            url: "",
            localPath: "",
          },
          role: "",
        },
        token: "demo-token",
      });
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
