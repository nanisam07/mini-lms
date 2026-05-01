import { Tabs } from "expo-router";
export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" options={{ title: "Courses" }} />
      <Tabs.Screen name="bookmarks" options={{ title: "Bookmarks" }} />
      <Tabs.Screen name="profile" options={{ title: "Profile" }} />
    </Tabs>
  );
}
