import { useAuthStore } from "@/store/authStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuthStore();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      await login(email.trim(), password);
    } catch (err: any) {
      Alert.alert(
        "Login Failed",
        err?.response?.data?.message || "Invalid credentials",
      );
    }
  };

  return (
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
            backgroundColor: "#0f172a",
            justifyContent: "center",
            padding: 24,
          }}
        >
          {/* Header */}
          <View style={{ marginBottom: 40 }}>
            <Text
              style={{
                fontSize: 32,
                fontWeight: "bold",
                color: "#6366f1",
                marginBottom: 8,
              }}
            >
              Mini LMS
            </Text>
            <Text style={{ fontSize: 16, color: "#94a3b8" }}>
              Welcome back! Sign in to continue
            </Text>
          </View>

          {/* Email Input */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{ color: "#cbd5e1", marginBottom: 8, fontWeight: "500" }}
            >
              Email
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              placeholderTextColor="#475569"
              keyboardType="email-address"
              autoCapitalize="none"
              style={{
                backgroundColor: "#1e293b",
                color: "#f1f5f9",
                padding: 14,
                borderRadius: 12,
                fontSize: 16,
                borderWidth: 1,
                borderColor: "#334155",
              }}
            />
          </View>

          {/* Password Input */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{ color: "#cbd5e1", marginBottom: 8, fontWeight: "500" }}
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
                padding: 14,
                borderRadius: 12,
                fontSize: 16,
                borderWidth: 1,
                borderColor: "#334155",
              }}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            style={{
              backgroundColor: "#6366f1",
              padding: 16,
              borderRadius: 12,
              alignItems: "center",
              marginBottom: 16,
              opacity: isLoading ? 0.7 : 1,
            }}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          {/* Register Link */}
          <TouchableOpacity
            onPress={() => router.push("/(auth)/register")}
            style={{ alignItems: "center" }}
          >
            <Text style={{ color: "#94a3b8" }}>
              Don't have an account?{" "}
              <Text style={{ color: "#6366f1", fontWeight: "bold" }}>
                Sign Up
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
