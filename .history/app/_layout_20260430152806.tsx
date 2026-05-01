import { useAuthStore } from "@/store/authStore";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";

function AuthGuard() {
  const { token, loadStoredAuth } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

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

  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthGuard />
    </SafeAreaProvider>
  );
}
