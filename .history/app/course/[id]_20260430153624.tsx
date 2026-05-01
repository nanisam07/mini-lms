import { useAuthStore } from "@/store/authStore";
import { useCourseStore } from "@/store/courseStore";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CourseDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { courses, bookmarks, toggleBookmark } = useCourseStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const course = courses.find((c) => c.id === id);

  if (!course) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0f172a",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#f1f5f9" }}>Course not found</Text>
      </View>
    );
  }

  const isBookmarked = bookmarks.includes(course.id);

  const handleEnroll = () => {
    Alert.alert(
      "Enrolled! 🎉",
      `You have successfully enrolled in "${course.title}"`,
      [
        {
          text: "Start Learning",
          onPress: () =>
            router.push({
              pathname: "/webview",
              params: { courseId: course.id, title: course.title },
            }),
        },
      ],
    );
  };

  const handleViewContent = () => {
    router.push({
      pathname: "/webview",
      params: { courseId: course.id, title: course.title },
    });
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      {/* Back Button */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={{
          position: "absolute",
          top: insets.top + 10,
          left: 16,
          zIndex: 10,
          backgroundColor: "rgba(0,0,0,0.5)",
          borderRadius: 20,
          padding: 8,
        }}
      >
        <Ionicons name="arrow-back" size={22} color="#fff" />
      </TouchableOpacity>

      {/* Bookmark Button */}
      <TouchableOpacity
        onPress={() => toggleBookmark(course.id)}
        style={{
          position: "absolute",
          top: insets.top + 10,
          right: 16,
          zIndex: 10,
          backgroundColor: "rgba(0,0,0,0.5)",
          borderRadius: 20,
          padding: 8,
        }}
      >
        <Ionicons
          name={isBookmarked ? "bookmark" : "bookmark-outline"}
          size={22}
          color={isBookmarked ? "#6366f1" : "#fff"}
        />
      </TouchableOpacity>

      <ScrollView>
        {/* Thumbnail */}
        <Image
          source={{ uri: course.thumbnail }}
          style={{ width: "100%", height: 250 }}
          resizeMode="cover"
        />

        <View style={{ padding: 20 }}>
          {/* Category Badge */}
          <View
            style={{
              backgroundColor: "#312e81",
              alignSelf: "flex-start",
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
              marginBottom: 12,
            }}
          >
            <Text style={{ color: "#a5b4fc", fontSize: 12, fontWeight: "600" }}>
              {course.category?.toUpperCase()}
            </Text>
          </View>

          {/* Title */}
          <Text
            style={{
              color: "#f1f5f9",
              fontSize: 22,
              fontWeight: "bold",
              marginBottom: 12,
            }}
          >
            {course.title}
          </Text>

          {/* Rating & Price Row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 16,
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 4 }}
            >
              <Ionicons name="star" size={16} color="#fbbf24" />
              <Text style={{ color: "#fbbf24", fontWeight: "bold" }}>
                {course.rating}
              </Text>
              <Text style={{ color: "#64748b" }}> rating</Text>
            </View>
            <Text
              style={{ color: "#6366f1", fontSize: 24, fontWeight: "bold" }}
            >
              ${course.price}
            </Text>
          </View>

          {/* Instructor */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: "#1e293b",
              padding: 14,
              borderRadius: 12,
              marginBottom: 20,
              gap: 12,
            }}
          >
            <Image
              source={{ uri: course.instructorAvatar }}
              style={{ width: 48, height: 48, borderRadius: 24 }}
            />
            <View>
              <Text style={{ color: "#94a3b8", fontSize: 12 }}>Instructor</Text>
              <Text
                style={{ color: "#f1f5f9", fontWeight: "bold", fontSize: 16 }}
              >
                {course.instructor}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text
            style={{
              color: "#f1f5f9",
              fontSize: 16,
              fontWeight: "bold",
              marginBottom: 8,
            }}
          >
            About this course
          </Text>
          <Text style={{ color: "#94a3b8", lineHeight: 24, marginBottom: 24 }}>
            {course.description}
          </Text>

          {/* What you'll learn */}
          <View
            style={{
              backgroundColor: "#1e293b",
              borderRadius: 12,
              padding: 16,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                color: "#f1f5f9",
                fontWeight: "bold",
                fontSize: 16,
                marginBottom: 12,
              }}
            >
              What you'll learn
            </Text>
            {[
              "Fundamentals and core concepts",
              "Hands-on practical projects",
              "Industry best practices",
              "Real-world applications",
            ].map((item, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 8,
                  gap: 8,
                }}
              >
                <Ionicons name="checkmark-circle" size={18} color="#6366f1" />
                <Text style={{ color: "#94a3b8" }}>{item}</Text>
              </View>
            ))}
          </View>

          {/* View Content Button */}
          <TouchableOpacity
            onPress={handleViewContent}
            style={{
              backgroundColor: "#1e293b",
              padding: 16,
              borderRadius: 12,
              alignItems: "center",
              marginBottom: 12,
              borderWidth: 1,
              borderColor: "#6366f1",
            }}
          >
            <Text
              style={{ color: "#6366f1", fontSize: 16, fontWeight: "bold" }}
            >
              Preview Content
            </Text>
          </TouchableOpacity>

          {/* Enroll Button */}
          <TouchableOpacity
            onPress={handleEnroll}
            style={{
              backgroundColor: "#6366f1",
              padding: 18,
              borderRadius: 12,
              alignItems: "center",
              marginBottom: 30,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 16, fontWeight: "bold" }}>
              Enroll Now — ${course.price}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
