import { useAuthStore } from "@/store/authStore";
import { useCourseStore } from "@/store/courseStore";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
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
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
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

      {/* Bookmark */}
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
        {/* HERO IMAGE */}
        <View>
          <Image
            source={{ uri: course.thumbnail }}
            style={{ width: "100%", height: 260 }}
            resizeMode="cover"
          />

          <LinearGradient
            colors={["transparent", "#0f172a"]}
            style={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              height: 120,
            }}
          />

          <Animated.View
            entering={FadeInUp.duration(600)}
            style={{
              position: "absolute",
              bottom: 20,
              left: 20,
              right: 20,
            }}
          >
            <Text
              style={{
                color: "#fff",
                fontSize: 24,
                fontWeight: "bold",
              }}
            >
              {course.title}
            </Text>
          </Animated.View>
        </View>

        <View style={{ padding: 20 }}>
          {/* Category */}
          <Animated.View entering={FadeInDown.delay(200)}>
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
              <Text
                style={{
                  color: "#a5b4fc",
                  fontSize: 12,
                  fontWeight: "600",
                }}
              >
                {course.category?.toUpperCase()}
              </Text>
            </View>
          </Animated.View>

          {/* Rating + Price */}
          <Animated.View entering={FadeInDown.delay(300)}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 16,
              }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="star" size={16} color="#fbbf24" />
                <Text
                  style={{
                    color: "#fbbf24",
                    fontWeight: "bold",
                    marginLeft: 4,
                  }}
                >
                  {course.rating}
                </Text>
                <Text style={{ color: "#64748b", marginLeft: 4 }}>rating</Text>
              </View>

              <Text
                style={{
                  color: "#6366f1",
                  fontSize: 24,
                  fontWeight: "bold",
                }}
              >
                ${course.price}
              </Text>
            </View>
          </Animated.View>

          {/* Instructor */}
          <Animated.View entering={FadeInDown.delay(400)}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "#1e293b",
                padding: 16,
                borderRadius: 16,
                marginBottom: 20,
                shadowColor: "#000",
                shadowOpacity: 0.3,
                shadowRadius: 10,
                elevation: 5,
              }}
            >
              <Image
                source={{ uri: course.instructorAvatar }}
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 25,
                  borderWidth: 2,
                  borderColor: "#6366f1",
                  marginRight: 12,
                }}
              />
              <View>
                <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                  Instructor
                </Text>
                <Text
                  style={{
                    color: "#f1f5f9",
                    fontWeight: "bold",
                    fontSize: 16,
                  }}
                >
                  {course.instructor}
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInDown.delay(500)}>
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

            <Text
              style={{
                color: "#94a3b8",
                lineHeight: 24,
                marginBottom: 24,
              }}
            >
              {course.description}
            </Text>
          </Animated.View>

          {/* Learn Section */}
          <Animated.View entering={FadeInDown.delay(600)}>
            <View
              style={{
                backgroundColor: "#1e293b",
                borderRadius: 16,
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
                { text: "Core fundamentals", icon: "flash" },
                { text: "Hands-on projects", icon: "code-slash" },
                { text: "Industry practices", icon: "rocket" },
                { text: "Real-world use", icon: "layers" },
              ].map((item, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    marginBottom: 10,
                  }}
                >
                  <Ionicons name={item.icon as any} size={18} color="#6366f1" />
                  <Text style={{ color: "#94a3b8", marginLeft: 8 }}>
                    {item.text}
                  </Text>
                </View>
              ))}
            </View>
          </Animated.View>

          {/* Preview Button */}
          <TouchableOpacity
            onPress={handleViewContent}
            activeOpacity={0.8}
            style={{
              backgroundColor: "#1e293b",
              padding: 16,
              borderRadius: 14,
              alignItems: "center",
              marginBottom: 12,
              borderWidth: 1,
              borderColor: "#6366f1",
            }}
          >
            <Text
              style={{
                color: "#6366f1",
                fontSize: 16,
                fontWeight: "bold",
              }}
            >
              Preview Content
            </Text>
          </TouchableOpacity>

          {/* Enroll Button */}
          <TouchableOpacity
            onPress={handleEnroll}
            activeOpacity={0.85}
            style={{
              backgroundColor: "#6366f1",
              padding: 18,
              borderRadius: 14,
              alignItems: "center",
              marginBottom: 30,
              shadowColor: "#6366f1",
              shadowOpacity: 0.6,
              shadowRadius: 10,
              elevation: 6,
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
