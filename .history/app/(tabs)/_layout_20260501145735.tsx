import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface TabIconProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
}

function TabIcon({ icon, label, focused }: TabIconProps) {
  // Simple scale animation for the icon
  const animatedIconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(focused ? 1.2 : 1) }],
  }));

  return (
    <View style={styles.tabItem}>
      <Animated.View style={animatedIconStyle}>
        <Ionicons
          name={icon}
          size={22}
          color={focused ? "#818cf8" : "#64748b"}
        />
      </Animated.View>
      <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
      {focused && <View style={styles.activeIndicator} />}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView
              intensity={80}
              tint="dark"
              style={StyleSheet.absoluteFill}
            />
          ) : (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: "#0f172a", opacity: 0.95 },
              ]}
            />
          ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={focused ? "home" : "home-outline"}
              label="Home"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={focused ? "bookmark" : "bookmark-outline"}
              label="Saved"
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon
              icon={focused ? "person" : "person-outline"}
              label="Profile"
              focused={focused}
            />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 25 : 15,
    left: 20,
    right: 20,
    height: 65,
    elevation: 0,
    backgroundColor: "rgba(15, 23, 42, 0.8)",
    borderRadius: 25,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.1)",
    borderLeftWidth: 1,
    borderLeftColor: "rgba(255, 255, 255, 0.05)",
    borderRightWidth: 1,
    borderRightColor: "rgba(255, 255, 255, 0.05)",
    paddingBottom: 0, // Reset default padding
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    top: 10, // Centers icons vertically within the floating bar
  },
  label: {
    fontSize: 11,
    color: "#64748b",
    fontWeight: "600",
    marginTop: 4,
  },
  labelActive: {
    color: "#f8fafc",
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#818cf8",
    marginTop: 4,
    shadowColor: "#818cf8",
    shadowRadius: 4,
    shadowOpacity: 0.8,
  },
});
