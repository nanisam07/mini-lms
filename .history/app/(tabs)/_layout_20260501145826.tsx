import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { Tabs } from "expo-router";
import { Platform, StyleSheet, Text } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring
} from "react-native-reanimated";

interface TabIconProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  focused: boolean;
}

function TabIcon({ icon, label, focused }: TabIconProps) {
  // Smoothly scale icon and text on focus
  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: withSpring(focused ? 1.05 : 1, { damping: 15 }) }],
  }));

  return (
    <Animated.View style={[styles.tabItem, animatedContainerStyle]}>
      <Ionicons name={icon} size={22} color={focused ? "#fff" : "#94a3b8"} />
      <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
    </Animated.View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        // Using a semi-transparent blur for that "Frosted Glass" look
        tabBarBackground: () => (
          <BlurView
            intensity={Platform.OS === "ios" ? 40 : 100}
            tint="dark"
            style={StyleSheet.absoluteFill}
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
    bottom: Platform.OS === "ios" ? 30 : 20,
    marginHorizontal: 20,
    height: 70,
    borderRadius: 35,
    backgroundColor: "rgba(15, 23, 42, 0.7)", // Deep Slate translucent
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.1)",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    paddingBottom: 0,
    // This removes the default border line on top of Tabs
    borderTopWidth: 1,
  },
  tabItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 25,
    // Centering the items vertically
    marginTop: 10,
  },
  label: {
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: "600",
    marginLeft: 8,
    // Only show label if the icon is NOT focused?
    // Actually, for a "Premium" look, we hide label when not focused
    display: "none",
  },
  labelActive: {
    color: "#fff",
    display: "flex", // Show label only when focused
  },
});
