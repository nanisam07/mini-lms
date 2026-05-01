import axios from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = "https://api.freeapi.app";

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Attach token to every request automatically
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle errors globally
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("auth_token");
    }
    return Promise.reject(error);
  },
);
