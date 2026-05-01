import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuthStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const handleLogin = async () => {
    console.log("=== LOGIN PRESSED ===");
    console.log("Email:", email);
    console.log("Password:", password);

    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      console.log("=== CALLING API ===");
      await login(email.trim(), password);
      console.log("=== LOGIN SUCCESS ===");
    } catch (err: any) {
      console.log("=== LOGIN ERROR ===", err?.message);
      console.log("Response:", err?.response?.data);
      Alert.alert(
        "Login Failed",
        err?.response?.data?.message || "Invalid credentials",
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              padding: 24,
              paddingTop: insets.top + 40,
            }}
          >
            {/* Logo area */}
            <View
              style={{
                width: 64,
                height: 64,
                backgroundColor: "#6366f1",
                borderRadius: 16,
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Text style={{ fontSize: 28 }}>📚</Text>
            </View>

            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: "#f1f5f9",
                marginBottom: 8,
              }}
            >
              Welcome Back
            </Text>
            <Text style={{ fontSize: 16, color: "#94a3b8", marginBottom: 40 }}>
              Sign in to continue learning
            </Text>

            {/* Email */}
            <Text
              style={{
                color: "#cbd5e1",
                marginBottom: 8,
                fontWeight: "600",
                fontSize: 14,
              }}
            >
              Email Address
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor="#475569"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                backgroundColor: "#1e293b",
                color: "#f1f5f9",
                padding: 16,
                borderRadius: 12,
                fontSize: 16,
                borderWidth: 1,
                borderColor: "#334155",
                marginBottom: 20,
              }}
            />

            {/* Password */}
            <Text
              style={{
                color: "#cbd5e1",
                marginBottom: 8,
                fontWeight: "600",
                fontSize: 14,
              }}
            >
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              placeholderTextColor="#475569"
              secureTextEntry
              style={{
                backgroundColor: "#1e293b",
                color: "#f1f5f9",
                padding: 16,
                borderRadius: 12,
                fontSize: 16,
                borderWidth: 1,
                borderColor: "#334155",
                marginBottom: 32,
              }}
            />

            {/* Login Button */}
            <TouchableOpacity
              onPress={handleLogin}
              disabled={isLoading}
              style={{
                backgroundColor: "#6366f1",
                padding: 18,
                borderRadius: 12,
                alignItems: "center",
                marginBottom: 20,
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text
                  style={{
                    color: "#fff",
                    fontSize: 16,
                    fontWeight: "bold",
                    letterSpacing: 0.5,
                  }}
                >
                  Sign In
                </Text>
              )}
            </TouchableOpacity>

            {/* Register link */}
            <TouchableOpacity
              onPress={() => router.push("/(auth)/register")}
              style={{ alignItems: "center", padding: 8 }}
            >
              <Text style={{ color: "#94a3b8", fontSize: 15 }}>
                Don't have an account?{" "}
                <Text style={{ color: "#6366f1", fontWeight: "bold" }}>
                  Sign Up
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
