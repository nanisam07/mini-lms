import { useAuthStore } from "@/store/authStore";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import "../global.css";

export default function RootLayout() {
  const { token, loadStoredAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    loadStoredAuth();
  }, []);

  useEffect(() => {
    const inAuth = segments[0] === "(auth)";
    if (!token && !inAuth) {
      router.replace("/(auth)/login");
    } else if (token && inAuth) {
      router.replace("/(tabs)");
    }
  }, [token, segments]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="course/[id]" />
      <Stack.Screen name="webview" />
    </Stack>
  );
}
