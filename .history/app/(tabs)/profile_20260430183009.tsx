import { useAuthStore } from "@/store/authStore";
import { useCourseStore } from "@/store/courseStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  Alert,
  Image,
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
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 🔥 HEADER */}
      <LinearGradient
        colors={["#1a1040", "#0f172a"]}
        style={[styles.header, { paddingTop: insets.top + 10 }]}
      >
        <Text style={styles.headerTitle}>Profile</Text>

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <LinearGradient
            colors={["#6366f1", "#8b5cf6"]}
            style={styles.avatarRing}
          >
            {user?.avatar?.url ? (
              <Image source={{ uri: user.avatar.url }} style={styles.avatar} />
            ) : (
              <Text style={styles.avatarText}>
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </Text>
            )}
          </LinearGradient>
        </View>

        <Text style={styles.name}>{user?.username || "User"}</Text>
        <Text style={styles.email}>{user?.email}</Text>
      </LinearGradient>

      {/* 🔥 STATS */}
      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{courses.length}</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{bookmarks.length}</Text>
          <Text style={styles.statLabel}>Bookmarks</Text>
        </View>
      </View>

      {/* 🔥 MENU */}
      <View style={styles.menuContainer}>
        {[
          { icon: "person-outline", label: "Edit Profile" },
          { icon: "notifications-outline", label: "Notifications" },
          { icon: "shield-outline", label: "Privacy" },
          { icon: "help-circle-outline", label: "Help & Support" },
        ].map((item) => (
          <TouchableOpacity key={item.label} style={styles.menuItem}>
            <Ionicons name={item.icon as any} size={22} color="#6366f1" />
            <Text style={styles.menuText}>{item.label}</Text>
            <Ionicons
              name="chevron-forward"
              size={18}
              color="#475569"
              style={{ marginLeft: "auto" }}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* 🔥 LOGOUT BUTTON */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <LinearGradient
          colors={["#ef4444", "#dc2626"]}
          style={styles.logoutInner}
        >
          <Ionicons name="log-out-outline" size={20} color="#fff" />
          <Text style={styles.logoutText}>Logout</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },

  header: {
    alignItems: "center",
    paddingBottom: 30,
  },

  headerTitle: {
    color: "#f1f5f9",
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 20,
  },

  avatarWrapper: {
    borderRadius: 60,
    padding: 4,
    marginBottom: 10,
  },

  avatarRing: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
  },

  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
  },

  avatarText: {
    fontSize: 36,
    color: "#fff",
    fontWeight: "700",
  },

  name: {
    color: "#f1f5f9",
    fontSize: 20,
    fontWeight: "700",
    marginTop: 6,
  },

  email: {
    color: "#94a3b8",
    fontSize: 13,
  },

  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: -20,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#1e293b",
    marginHorizontal: 6,
    borderRadius: 16,
    padding: 18,
    alignItems: "center",
  },

  statNumber: {
    color: "#6366f1",
    fontSize: 20,
    fontWeight: "800",
  },

  statLabel: {
    color: "#64748b",
    fontSize: 12,
    marginTop: 4,
  },

  menuContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
  },

  menuText: {
    color: "#f1f5f9",
    marginLeft: 12,
    fontSize: 15,
  },

  logoutBtn: {
    marginTop: 20,
    marginHorizontal: 20,
  },

  logoutInner: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "700",
    marginLeft: 8,
  },
});
