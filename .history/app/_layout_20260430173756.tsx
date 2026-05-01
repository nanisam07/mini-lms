import { useAuthStore } from "@/store/authStore";
import { Stack } from "expo-router";

export default function RootLayout() {
  const { user } = useAuthStore();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!user ? (
        // 🔐 AUTH SCREENS
        <>
          <Stack.Screen name="(auth)/login" />
          <Stack.Screen name="(auth)/register" />
        </>
      ) : (
        // 📱 MAIN APP
        <>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="course/[id]" />
          <Stack.Screen name="webview" />
        </>
      )}
    </Stack>
  );
}
