import { LinearGradient } from "expo-linear-gradient";
import { Link, router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../../store/authStore";

const { width, height } = Dimensions.get("window");

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isLoading } = useAuthStore();
  const [error, setError] = useState("");

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const logoScale = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    await login(username, password);
    router.replace("/(tabs)");
  };

  return (
    <LinearGradient
      colors={["#0f172a", "#1a1040", "#0f172a"]}
      locations={[0, 0.5, 1]}
      style={styles.container}
    >
      {/* Decorative orbs */}
      <View style={styles.orb1} />
      <View style={styles.orb2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.inner}
      >
        {/* Logo / Brand */}
        <Animated.View
          style={[
            styles.logoSection,
            { opacity: fadeAnim, transform: [{ scale: logoScale }] },
          ]}
        >
          <LinearGradient
            colors={["#6366f1", "#8b5cf6"]}
            style={styles.logoRing}
          >
            <Text style={styles.logoEmoji}>🎓</Text>
          </LinearGradient>
          <Text style={styles.brandName}>MiniLMS</Text>
          <Text style={styles.tagline}>Learn at your own pace</Text>
        </Animated.View>

        {/* Form Card */}
        <Animated.View
          style={[
            styles.card,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <Text style={styles.heading}>Welcome back</Text>
          <Text style={styles.subheading}>Sign in to continue learning</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Username</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your username"
                placeholderTextColor="#475569"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputWrapper}>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                placeholderTextColor="#475569"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.85}
            style={styles.btnWrapper}
          >
            <LinearGradient
              colors={
                isLoading ? ["#4338ca", "#4338ca"] : ["#6366f1", "#8b5cf6"]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.btn}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.btnText}>Sign In →</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={styles.footerLink}>Create one</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </Animated.View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  orb1: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: "#6366f120",
    top: -80,
    right: -80,
  },
  orb2: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#8b5cf615",
    bottom: 60,
    left: -60,
  },
  logoSection: {
    alignItems: "center",
    marginBottom: 36,
  },
  logoRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#6366f1",
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 6 },
    elevation: 12,
  },
  logoEmoji: { fontSize: 32 },
  brandName: {
    fontSize: 28,
    fontWeight: "800",
    color: "#f1f5f9",
    letterSpacing: 1,
  },
  tagline: { fontSize: 13, color: "#94a3b8", marginTop: 4 },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 24,
    padding: 28,
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 8 },
    elevation: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: "700",
    color: "#f1f5f9",
    marginBottom: 4,
  },
  subheading: { fontSize: 14, color: "#94a3b8", marginBottom: 24 },
  errorBox: {
    backgroundColor: "#450a0a",
    borderWidth: 1,
    borderColor: "#991b1b",
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  errorText: { color: "#fca5a5", fontSize: 13 },
  inputGroup: { marginBottom: 16 },
  label: {
    color: "#94a3b8",
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  inputWrapper: {
    backgroundColor: "#0f172a",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#334155",
  },
  input: {
    color: "#f1f5f9",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },
  btnWrapper: { marginTop: 8, borderRadius: 14, overflow: "hidden" },
  btn: {
    paddingVertical: 16,
    alignItems: "center",
    borderRadius: 14,
  },
  btnText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
  },
  footerText: { color: "#64748b", fontSize: 14 },
  footerLink: { color: "#6366f1", fontSize: 14, fontWeight: "600" },
});
