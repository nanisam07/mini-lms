import { useAuthStore } from "@/store/authStore";
import { useCourseStore } from "@/store/courseStore";
import { Ionicons } from "@expo/vector-icons";
import {
  Alert,
  Image,
  StatusBar,
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
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <View style={{ padding: 20, paddingTop: insets.top + 10 }}>
        <Text style={{ color: "#f1f5f9", fontSize: 24, fontWeight: "bold" }}>
          Profile
        </Text>
      </View>

      {/* Avatar & Name */}
      <View style={{ alignItems: "center", paddingVertical: 24 }}>
        <View
          style={{
            width: 90,
            height: 90,
            borderRadius: 45,
            backgroundColor: "#6366f1",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          {user?.avatar?.url ? (
            <Image
              source={{ uri: user.avatar.url }}
              style={{ width: 90, height: 90, borderRadius: 45 }}
            />
          ) : (
            <Text style={{ fontSize: 36 }}>
              {user?.username?.charAt(0).toUpperCase() || "U"}
            </Text>
          )}
        </View>
        <Text style={{ color: "#f1f5f9", fontSize: 20, fontWeight: "bold" }}>
          {user?.username || "User"}
        </Text>
        <Text style={{ color: "#94a3b8", marginTop: 4 }}>
          {user?.email || ""}
        </Text>
      </View>

      {/* Stats */}
      <View
        style={{
          flexDirection: "row",
          marginHorizontal: 20,
          backgroundColor: "#1e293b",
          borderRadius: 16,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ color: "#6366f1", fontSize: 28, fontWeight: "bold" }}>
            {courses.length}
          </Text>
          <Text style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>
            Courses
          </Text>
        </View>
        <View
          style={{ width: 1, backgroundColor: "#334155", marginHorizontal: 10 }}
        />
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={{ color: "#6366f1", fontSize: 28, fontWeight: "bold" }}>
            {bookmarks.length}
          </Text>
          <Text style={{ color: "#94a3b8", fontSize: 13, marginTop: 4 }}>
            Bookmarks
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      {[
        { icon: "person-outline", label: "Edit Profile" },
        { icon: "notifications-outline", label: "Notifications" },
        { icon: "shield-outline", label: "Privacy" },
        { icon: "help-circle-outline", label: "Help & Support" },
      ].map((item) => (
        <TouchableOpacity
          key={item.label}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 20,
            paddingVertical: 16,
            borderBottomWidth: 1,
            borderBottomColor: "#1e293b",
          }}
        >
          <Ionicons name={item.icon as any} size={22} color="#64748b" />
          <Text style={{ color: "#f1f5f9", marginLeft: 14, fontSize: 16 }}>
            {item.label}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={18}
            color="#475569"
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>
      ))}

      {/* Logout */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 20,
          paddingVertical: 16,
          marginTop: 8,
        }}
      >
        <Ionicons name="log-out-outline" size={22} color="#ef4444" />
        <Text
          style={{
            color: "#ef4444",
            marginLeft: 14,
            fontSize: 16,
            fontWeight: "600",
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}
