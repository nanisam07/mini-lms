import { useAuthStore } from "@/store/authStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (!email || !password) return;

    // 🔥 Fake auth (stable for demo)
    setUser({
      username: email.split("@")[0],
      email,
    });

    router.replace("/(tabs)");
  };

  return (
    <LinearGradient colors={["#0f172a", "#020617"]} style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back 👋</Text>
        <Text style={styles.subtitle}>Login to continue learning</Text>

        <TextInput
          placeholder="Email"
          placeholderTextColor="#64748b"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#64748b"
          style={styles.input}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <LinearGradient
            colors={["#6366f1", "#8b5cf6"]}
            style={styles.buttonInner}
          >
            <Text style={styles.buttonText}>Login</Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
          <Text style={styles.link}>
            Don’t have an account?{" "}
            <Text style={{ color: "#6366f1" }}>Register</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  card: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 20,
  },
  title: {
    color: "#f1f5f9",
    fontSize: 22,
    fontWeight: "700",
  },
  subtitle: {
    color: "#94a3b8",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "#020617",
    color: "#f1f5f9",
    padding: 14,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  button: { marginTop: 10 },
  buttonInner: {
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
  },
  link: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 16,
  },
});
