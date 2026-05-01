import { useCourseStore } from "@/store/courseStore";
import { Course } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  RefreshControl,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function CourseCard({ course }: { course: Course }) {
  const { bookmarks, toggleBookmark } = useCourseStore();
  const router = useRouter();
  const isBookmarked = bookmarks.includes(course.id);

  return (
    <TouchableOpacity
      onPress={() => router.push(`/course/${course.id}`)}
      style={{
        backgroundColor: "#1e293b",
        borderRadius: 16,
        marginBottom: 16,
        overflow: "hidden",
      }}
    >
      <Image
        source={{ uri: course.thumbnail }}
        style={{ width: "100%", height: 160 }}
        resizeMode="cover"
      />
      <View style={{ padding: 12 }}>
        <View
          style={{
            backgroundColor: "#312e81",
            alignSelf: "flex-start",
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 6,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: "#a5b4fc", fontSize: 11, fontWeight: "600" }}>
            {course.category?.toUpperCase()}
          </Text>
        </View>
        <Text
          style={{
            color: "#f1f5f9",
            fontSize: 16,
            fontWeight: "bold",
            marginBottom: 6,
          }}
          numberOfLines={2}
        >
          {course.title}
        </Text>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            <Image
              source={{ uri: course.instructorAvatar }}
              style={{ width: 24, height: 24, borderRadius: 12 }}
            />
            <Text style={{ color: "#94a3b8", fontSize: 13 }}>
              {course.instructor}
            </Text>
          </View>
          <TouchableOpacity onPress={() => toggleBookmark(course.id)}>
            <Ionicons
              name={isBookmarked ? "bookmark" : "bookmark-outline"}
              size={22}
              color={isBookmarked ? "#6366f1" : "#64748b"}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: 10,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#6366f1", fontWeight: "bold", fontSize: 16 }}>
            ${course.price}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
            <Ionicons name="star" size={14} color="#fbbf24" />
            <Text style={{ color: "#fbbf24", fontSize: 13 }}>
              {course.rating}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function Home() {
  const { courses, isLoading, error, fetchCourses, loadBookmarks } =
    useCourseStore();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    loadBookmarks();
    fetchCourses();
    requestPermission();
  }, []);

  const requestPermission = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    console.log("Notification permission:", status);
  };

  const testNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "🔔 Test Notification",
          body: "Notifications are working!",
        },
        trigger: null,
      });
      console.log("Notification scheduled!");
    } catch (e: any) {
      console.log("Notification error:", e.message);
      Alert.alert("Error", e.message);
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCourses();
    setRefreshing(false);
  }, []);

  const filtered = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(search.toLowerCase()) ||
      c.instructor.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Header */}
      <View style={{ padding: 20, paddingTop: insets.top + 10 }}>
        <Text style={{ color: "#94a3b8", fontSize: 14 }}>Welcome back 👋</Text>
        <Text
          style={{
            color: "#f1f5f9",
            fontSize: 24,
            fontWeight: "bold",
            marginTop: 4,
          }}
        >
          Explore Courses
        </Text>

        {/* Search */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            backgroundColor: "#1e293b",
            borderRadius: 12,
            marginTop: 16,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderColor: "#334155",
          }}
        >
          <Ionicons name="search" size={18} color="#64748b" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search courses..."
            placeholderTextColor="#475569"
            style={{ flex: 1, color: "#f1f5f9", padding: 12, fontSize: 15 }}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color="#64748b" />
            </TouchableOpacity>
          )}
        </View>

        {/* Test Notification Button */}
        <TouchableOpacity
          onPress={testNotification}
          style={{
            backgroundColor: "#22c55e",
            padding: 12,
            borderRadius: 8,
            marginTop: 12,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "bold" }}>
            🔔 Test Notification
          </Text>
        </TouchableOpacity>
      </View>

      {/* Error */}
      {error && (
        <View style={{ paddingHorizontal: 20, marginBottom: 10 }}>
          <Text style={{ color: "#f87171", textAlign: "center" }}>{error}</Text>
          <TouchableOpacity onPress={fetchCourses} style={{ marginTop: 8 }}>
            <Text
              style={{
                color: "#6366f1",
                textAlign: "center",
                fontWeight: "bold",
              }}
            >
              Retry
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Loading */}
      {isLoading && !refreshing ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={{ color: "#94a3b8", marginTop: 12 }}>
            Loading courses...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <CourseCard course={item} />}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#6366f1"
            />
          }
          ListEmptyComponent={
            <View style={{ alignItems: "center", marginTop: 60 }}>
              <Ionicons name="book-outline" size={48} color="#334155" />
              <Text style={{ color: "#64748b", marginTop: 12, fontSize: 16 }}>
                No courses found
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
