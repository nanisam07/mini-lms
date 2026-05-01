import { useAuthStore } from "@/store/authStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";

const { width } = Dimensions.get("window");

export default function LoginScreen() {
  const router = useRouter();
  const { setUser } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleLogin = () => {
    if (!email || !password) return;

    setUser({
      username: email.split("@")[0],
      email,
      _id: "1",
      avatar: { url: "", localPath: "" },
      role: "student",
    });

    router.replace("/(tabs)");
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
          { top: -50, right: -50, backgroundColor: "#4338ca" },
        ]}
      />
      <View
        style={[
          styles.glow,
          { bottom: 100, left: -80, backgroundColor: "#6366f1", opacity: 0.15 },
        ]}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.content}
      >
        <Animated.View
          entering={FadeInDown.duration(800).springify()}
          style={styles.header}
        >
          <View style={styles.logoCircle}>
            <Ionicons name="book" size={32} color="#fff" />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Unlock your potential today</Text>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(200).duration(800)}
          style={styles.card}
        >
          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#64748b"
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Email Address"
              placeholderTextColor="#64748b"
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
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
              placeholder="Password"
              placeholderTextColor="#64748b"
              style={styles.input}
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
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

          <TouchableOpacity style={styles.forgotBtn}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#6366f1", "#8b5cf6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.buttonInner}
            >
              <Text style={styles.buttonText}>Sign In</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color="#fff"
                style={{ marginLeft: 8 }}
              />
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(400)} style={styles.footer}>
          <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
            <Text style={styles.link}>
              New here?{" "}
              <Text style={styles.linkHighlight}>Create an Account</Text>
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
  background: { ...StyleSheet.absoluteFillObject },
  glow: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    opacity: 0.2,
    filter: Platform.OS === "ios" ? "blur(60px)" : "none", // Use BlurView for android if needed
  },
  content: { flex: 1, justifyContent: "center", padding: 24 },

  header: { alignItems: "center", marginBottom: 40 },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 24,
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.3)",
  },
  title: {
    color: "#f8fafc",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -1,
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 16,
    marginTop: 8,
  },

  card: {
    backgroundColor: "rgba(30, 41, 59, 0.5)",
    padding: 24,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 20 },
        shadowOpacity: 0.3,
        shadowRadius: 30,
      },
      android: { elevation: 10 },
    }),
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
  forgotBtn: { alignSelf: "flex-end", marginBottom: 24 },
  forgotText: { color: "#818cf8", fontSize: 13, fontWeight: "600" },

  button: { marginTop: 8 },
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
  link: {
    color: "#94a3b8",
    textAlign: "center",
    fontSize: 15,
  },
  linkHighlight: { color: "#818cf8", fontWeight: "700" },
});
