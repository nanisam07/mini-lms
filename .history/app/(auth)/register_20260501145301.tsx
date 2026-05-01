import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

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
      Alert.alert("Success", "Welcome to the academy!");
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert(
        "Registration Failed",
        err?.response?.data?.message || "Something went wrong",
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 🌌 IMMERSIVE BACKGROUND */}
      <LinearGradient
        colors={["#0f172a", "#020617"]}
        style={styles.background}
      />

      {/* Decorative Glow Blobs */}
      <View
        style={[
          styles.glow,
          { top: -50, left: -50, backgroundColor: "#4338ca" },
        ]}
      />
      <View
        style={[
          styles.glow,
          { bottom: -20, right: -80, backgroundColor: "#8b5cf6", opacity: 0.1 },
        ]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={24} color="#f8fafc" />
          </TouchableOpacity>

          <Animated.View
            entering={FadeInDown.duration(800).springify()}
            style={styles.header}
          >
            <Text style={styles.title}>Join Us</Text>
            <Text style={styles.subtitle}>
              Start your learning journey today
            </Text>
          </Animated.View>

          <Animated.View
            entering={FadeInUp.delay(200).duration(800)}
            style={styles.card}
          >
            {/* Username Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#64748b"
                style={styles.inputIcon}
              />
              <TextInput
                value={username}
                onChangeText={(text) => setUsername(text.toLowerCase())}
                placeholder="Username"
                placeholderTextColor="#64748b"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="mail-outline"
                size={20}
                color="#64748b"
                style={styles.inputIcon}
              />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Email Address"
                placeholderTextColor="#64748b"
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color="#64748b"
                style={styles.inputIcon}
              />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Password (min. 6 chars)"
                placeholderTextColor="#64748b"
                secureTextEntry={!isPasswordVisible}
                style={styles.input}
              />
              <TouchableOpacity
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
              >
                <Ionicons
                  name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#64748b"
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={handleRegister}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#6366f1", "#8b5cf6"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.buttonInner}
              >
                {isLoading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <>
                    <Text style={styles.buttonText}>Create Account</Text>
                    <Ionicons
                      name="rocket-outline"
                      size={18}
                      color="#fff"
                      style={{ marginLeft: 8 }}
                    />
                  </>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInUp.delay(400)} style={styles.footer}>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.footerText}>
                Already a member?{" "}
                <Text style={styles.footerHighlight}>Sign In</Text>
              </Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
  background: { ...StyleSheet.absoluteFillObject },
  glow: {
    position: "absolute",
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    opacity: 0.15,
    filter: Platform.OS === "ios" ? "blur(60px)" : "none",
  },
  scrollContent: { flexGrow: 1, justifyContent: "center", padding: 24 },

  backBtn: {
    position: "absolute",
    top: 50,
    left: 24,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  header: { alignItems: "center", marginBottom: 32 },
  title: {
    color: "#f8fafc",
    fontSize: 36,
    fontWeight: "900",
    letterSpacing: -1.5,
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 16,
    marginTop: 8,
    textAlign: "center",
  },

  card: {
    backgroundColor: "rgba(30, 41, 59, 0.4)",
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#020617",
    paddingHorizontal: 16,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  inputIcon: { marginRight: 12 },
  input: {
    flex: 1,
    color: "#f1f5f9",
    paddingVertical: 16,
    fontSize: 15,
  },

  button: { marginTop: 12 },
  buttonInner: {
    flexDirection: "row",
    padding: 18,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
  },

  footer: { marginTop: 32 },
  footerText: {
    color: "#94a3b8",
    textAlign: "center",
    fontSize: 15,
  },
  footerHighlight: { color: "#818cf8", fontWeight: "700" },
});
