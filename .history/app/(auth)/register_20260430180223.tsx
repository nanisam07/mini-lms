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

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  const handleRegister = async () => {
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters");
      return;
    }

    try {
      await register(username.trim().toLowerCase(), email.trim(), password);

      Alert.alert("Success", "Account created successfully!");

      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert(
        "Registration Failed",
        err?.response?.data?.message || "Something went wrong",
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
              Create Account
            </Text>
            <Text style={{ color: "#94a3b8", fontSize: 16 }}>
              Join Mini LMS to start learning
            </Text>
          </View>

          {/* Username */}
          <View style={{ marginBottom: 16 }}>
            <Text
              style={{ color: "#cbd5e1", marginBottom: 8, fontWeight: "500" }}
            >
              Username
            </Text>
            <TextInput
              value={username}
              onChangeText={(text) => setUsername(text.toLowerCase())}
              placeholder="Choose a username"
              placeholderTextColor="#475569"
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

          {/* Email */}
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

          {/* Password */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{ color: "#cbd5e1", marginBottom: 8, fontWeight: "500" }}
            >
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Min. 6 characters"
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

          {/* Register Button */}
          <TouchableOpacity
            onPress={handleRegister}
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
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          {/* Login Link */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ alignItems: "center" }}
          >
            <Text style={{ color: "#94a3b8" }}>
              Already have an account?{" "}
              <Text style={{ color: "#6366f1", fontWeight: "bold" }}>
                Sign In
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
