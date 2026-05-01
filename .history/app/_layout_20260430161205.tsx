import { useNotifications } from "@/hooks/useNotifications";
import { useAuthStore } from "@/store/authStore";

import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

function AuthGuard() {
  const { token, loadStoredAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useNotifications();

  useEffect(() => {
    loadStoredAuth();
  }, []);

  useEffect(() => {
    if (token === null) return;
    const inAuth = segments[0] === "(auth)";
    if (!token && !inAuth) {
      router.replace("/(auth)/login");
    } else if (token && inAuth) {
      router.replace("/(tabs)");
    }
  }, [token, segments]);

  return (
    <View style={{ flex: 1 }}>
      <Slot />
    </View>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthGuard />
    </SafeAreaProvider>
  );
}
