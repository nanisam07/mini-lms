import { useAuthStore } from "@/store/authStore";
import { useCourseStore } from "@/store/courseStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Profile() {
  const { user, logout } = useAuthStore();
  const { bookmarks, courses } = useCourseStore();
  const insets = useSafeAreaInsets();

  const handleLogout = () => {
    Alert.alert("Logout", "Leaving so soon?", [
      { text: "Stay", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  const MENU_ITEMS = [
    { icon: "person-outline", label: "Edit Account", color: "#6366f1" },
    { icon: "bookmark-outline", label: "Saved Content", color: "#8b5cf6" },
    { icon: "notifications-outline", label: "Preferences", color: "#ec4899" },
    { icon: "shield-checkmark-outline", label: "Security", color: "#10b981" },
    { icon: "help-buoy-outline", label: "Support Center", color: "#f59e0b" },
  ];

  return (
    <ScrollView
      bounces={false}
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      <StatusBar barStyle="light-content" />

      {/* 🌌 HERO HEADER */}
      <View style={styles.heroSection}>
        <LinearGradient
          colors={["#4338ca", "#1e1b4b", "#020617"]}
          style={[styles.headerGradient, { paddingTop: insets.top + 20 }]}
        />

        {/* Subtle Background Glow */}
        <View style={styles.glow} />

        <View style={styles.profileInfo}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={["#818cf8", "#c084fc"]}
              style={styles.avatarBorder}
            >
              <View style={styles.avatarInner}>
                {user?.avatar?.url ? (
                  <Image
                    source={{ uri: user.avatar.url }}
                    style={styles.avatar}
                  />
                ) : (
                  <Text style={styles.avatarLetter}>
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </Text>
                )}
              </View>
            </LinearGradient>
            <TouchableOpacity style={styles.editBadge}>
              <Ionicons name="camera" size={14} color="#fff" />
            </TouchableOpacity>
          </View>

          <Text style={styles.userName}>{user?.username || "Learner"}</Text>
          <Text style={styles.userEmail}>
            {user?.email || "student@academy.com"}
          </Text>
        </View>
      </View>

      {/* 📊 FLOATING STATS (Glassmorphism) */}
      <View style={styles.statsWrapper}>
        <View style={styles.statsBlur}>
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{courses.length}</Text>
            <Text style={styles.statLab}>Learning</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>{bookmarks.length}</Text>
            <Text style={styles.statLab}>Pinned</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statBox}>
            <Text style={styles.statVal}>85%</Text>
            <Text style={styles.statLab}>Progress</Text>
          </View>
        </View>
      </View>

      {/* 🛠 MENU SECTION */}
      <View style={styles.menuWrapper}>
        <Text style={styles.sectionTitle}>Account Settings</Text>
        {MENU_ITEMS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuCard}
            activeOpacity={0.7}
          >
            <View
              style={[styles.iconBg, { backgroundColor: `${item.color}15` }]}
            >
              <Ionicons name={item.icon as any} size={20} color={item.color} />
            </View>
            <Text style={styles.menuLabel}>{item.label}</Text>
            <Ionicons name="chevron-forward" size={16} color="#475569" />
          </TouchableOpacity>
        ))}
      </View>

      {/* 🚪 LOGOUT */}
      <TouchableOpacity style={styles.logoutWrapper} onPress={handleLogout}>
        <View style={styles.logoutContent}>
          <Ionicons name="log-out" size={20} color="#ef4444" />
          <Text style={styles.logoutLabel}>Sign Out</Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.version}>
        Version 2.0.4 • Crafted by Samuel Victor
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },

  heroSection: { height: 280, alignItems: "center" },
  headerGradient: {
    ...StyleSheet.absoluteFillObject,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  glow: {
    position: "absolute",
    top: -50,
    width: 200,
    height: 200,
    backgroundColor: "#6366f1",
    borderRadius: 100,
    opacity: 0.2,
    filter: "blur(50px)",
  },

  profileInfo: { alignItems: "center", marginTop: 10 },
  avatarContainer: { position: "relative" },
  avatarBorder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    padding: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInner: {
    width: "100%",
    height: "100%",
    borderRadius: 50,
    backgroundColor: "#1e1b4b",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  avatar: { width: "100%", height: "100%" },
  avatarLetter: { fontSize: 40, color: "#fff", fontWeight: "800" },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#6366f1",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#020617",
  },

  userName: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "800",
    marginTop: 15,
    letterSpacing: -0.5,
  },
  userEmail: { color: "#94a3b8", fontSize: 14, marginTop: 4 },

  statsWrapper: { paddingHorizontal: 24, marginTop: -40 },
  statsBlur: {
    flexDirection: "row",
    backgroundColor: "rgba(30, 41, 59, 0.7)",
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
    backdropFilter: "blur(10px)", // For web/ios support
  },
  statBox: { flex: 1, alignItems: "center" },
  statVal: { color: "#fff", fontSize: 20, fontWeight: "800" },
  statLab: { color: "#94a3b8", fontSize: 12, fontWeight: "600", marginTop: 2 },
  statDivider: {
    width: 1,
    height: "80%",
    backgroundColor: "rgba(255,255,255,0.1)",
    alignSelf: "center",
  },

  menuWrapper: { marginTop: 30, paddingHorizontal: 24 },
  sectionTitle: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 15,
    marginLeft: 5,
  },
  menuCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    padding: 12,
    borderRadius: 18,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#1e293b",
  },
  iconBg: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  menuLabel: {
    flex: 1,
    color: "#f1f5f9",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 15,
  },

  logoutWrapper: { marginTop: 10, paddingHorizontal: 24 },
  logoutContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 18,
    backgroundColor: "#ef444410",
    borderWidth: 1,
    borderColor: "#ef444430",
  },
  logoutLabel: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 10,
  },
  version: {
    color: "#475569",
    textAlign: "center",
    marginTop: 30,
    fontSize: 12,
  },
});
