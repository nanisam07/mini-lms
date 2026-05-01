import { useCourseStore } from "@/store/courseStore";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Bookmarks() {
  const { courses, bookmarks, toggleBookmark } = useCourseStore();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const bookmarkedCourses = courses.filter((c) => bookmarks.includes(c.id));

  return (
    <View style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />

      <View style={{ padding: 20, paddingTop: insets.top + 10 }}>
        <Text style={{ color: "#f1f5f9", fontSize: 24, fontWeight: "bold" }}>
          Bookmarks
        </Text>
        <Text style={{ color: "#94a3b8", marginTop: 4 }}>
          {bookmarkedCourses.length} saved courses
        </Text>
      </View>

      {bookmarkedCourses.length === 0 ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Ionicons name="bookmark-outline" size={64} color="#334155" />
          <Text style={{ color: "#64748b", marginTop: 16, fontSize: 16 }}>
            No bookmarks yet
          </Text>
          <Text style={{ color: "#475569", marginTop: 8, fontSize: 14 }}>
            Bookmark courses to save them here
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarkedCourses}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 20 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => router.push(`/course/${item.id}`)}
              style={{
                backgroundColor: "#1e293b",
                borderRadius: 16,
                marginBottom: 12,
                flexDirection: "row",
                overflow: "hidden",
              }}
            >
              <Image
                source={{ uri: item.thumbnail }}
                style={{ width: 100, height: 100 }}
                resizeMode="cover"
              />
              <View
                style={{
                  flex: 1,
                  padding: 12,
                  justifyContent: "space-between",
                }}
              >
                <Text
                  style={{ color: "#f1f5f9", fontWeight: "bold", fontSize: 14 }}
                  numberOfLines={2}
                >
                  {item.title}
                </Text>
                <Text style={{ color: "#94a3b8", fontSize: 12 }}>
                  {item.instructor}
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: "#6366f1", fontWeight: "bold" }}>
                    ${item.price}
                  </Text>
                  <TouchableOpacity onPress={() => toggleBookmark(item.id)}>
                    <Ionicons name="bookmark" size={20} color="#6366f1" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
