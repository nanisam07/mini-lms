import { Tabs } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

interface TabIconProps {
  emoji: string;
  label: string;
  focused: boolean;
}

function TabIcon({ emoji, label, focused }: TabIconProps) {
  return (
    <View style={[styles.tabItem, focused && styles.tabItemActive]}>
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={[styles.label, focused && styles.labelActive]}>{label}</Text>
      {focused && <View style={styles.dot} />}
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🏠" label="Home" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="bookmarks"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="🔖" label="Saved" focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon emoji="👤" label="Profile" focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#1e293b",
    borderTopWidth: 1,
    borderTopColor: "#334155",
    height: 70,
    paddingBottom: 8,
    paddingTop: 6,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 16,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 2,
    minWidth: 70,
  },
  tabItemActive: {
    backgroundColor: "#6366f115",
  },
  emoji: { fontSize: 20 },
  label: {
    fontSize: 10,
    color: "#64748b",
    fontWeight: "500",
  },
  labelActive: { color: "#6366f1", fontWeight: "700" },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#6366f1",
    marginTop: 2,
  },
});
