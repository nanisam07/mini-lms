import { useAuthStore } from "@/store/authStore";
import { Redirect } from "expo-router";

export default function Index() {
  const { user } = useAuthStore();

  console.log("USER STATE:", user);

  if (!user) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)" />;
}
