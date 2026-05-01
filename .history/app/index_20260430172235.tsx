import { LinearGradient } from "expo-linear-gradient";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    FlatList,
    Image,
    RefreshControl,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useCourseStore } from "@/store/courseStore";

export default function HomeScreen() {
  const router = useRouter();
  const { courses, fetchCourses, toggleBookmark, bookmarks } = useCourseStore();

  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCourses();
    setRefreshing(false);
  };

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      {/* 🔥 HEADER */}
      <LinearGradient
        colors={["#6366f1", "#4f46e5"]}
        style={{
          paddingTop: 50,
          paddingBottom: 20,
          paddingHorizontal: 20,
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 22, fontWeight: "bold" }}>
          Explore Courses
        </Text>

        {/* 🔍 Search */}
        <TextInput
          placeholder="Search courses..."
          placeholderTextColor="#cbd5f5"
          value={search}
          onChangeText={setSearch}
          style={{
            marginTop: 12,
            backgroundColor: "rgba(255,255,255,0.1)",
            padding: 12,
            borderRadius: 10,
            color: "#fff",
          }}
        />
      </LinearGradient>

      {/* 🧪 TEST NOTIFICATION BUTTON */}
      <TouchableOpacity
        onPress={async () => {
          console.log("TEST CLICKED");

          const { status } = await Notifications.requestPermissionsAsync();
          console.log("Permission:", status);

          await Notifications.scheduleNotificationAsync({
            content: {
              title: "TEST SUCCESS",
              body: "Notifications are working",
            },
            trigger: { seconds: 2 },
          });
        }}
        style={{
          backgroundColor: "red",
          padding: 12,
          margin: 16,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "bold" }}>
          TEST NOTIFICATION
        </Text>
      </TouchableOpacity>

      {/* 📚 COURSE LIST */}
      <FlatList
        data={filteredCourses}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item, index }) => {
          const isBookmarked = bookmarks.includes(item.id);

          return (
            <Animated.View entering={FadeInDown.delay(index * 100)}>
              <TouchableOpacity
                onPress={() =>
                  router.push({
                    pathname: "/course/[id]",
                    params: { id: item.id },
                  })
                }
                style={{
                  backgroundColor: "#1e293b",
                  borderRadius: 16,
                  marginBottom: 16,
                  overflow: "hidden",
                }}
              >
                {/* Image */}
                <Image
                  source={{ uri: item.thumbnail }}
                  style={{ width: "100%", height: 180 }}
                />

                {/* Content */}
                <View style={{ padding: 12 }}>
                  <Text
                    style={{
                      color: "#f1f5f9",
                      fontSize: 16,
                      fontWeight: "bold",
                    }}
                  >
                    {item.title}
                  </Text>

                  <Text style={{ color: "#94a3b8", marginTop: 4 }}>
                    ⭐ {item.rating}
                  </Text>

                  {/* Bookmark */}
                  <TouchableOpacity
                    onPress={() => {
                      toggleBookmark(item.id);

                      const updatedCount = bookmarks.includes(item.id)
                        ? bookmarks.length - 1
                        : bookmarks.length + 1;

                      // 👉 call your notification here
                      // scheduleBookmarkNotification(updatedCount);
                    }}
                    style={{ marginTop: 10 }}
                  >
                    <Text style={{ color: "#6366f1" }}>
                      {isBookmarked ? "Bookmarked" : "Bookmark"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        }}
      />
    </View>
  );
}
