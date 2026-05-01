import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { CourseCard } from "../../components/CourseCard";
import { useCourseStore } from "../../store/courseStore";

export default function BookmarksScreen() {
  const { courses, bookmarks, toggleBookmark } = useCourseStore();

  const bookmarkedCourses = courses.filter((c: any) =>
    bookmarks.includes(String(c.id)),
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={["#1a1040", "#0f172a"]} style={styles.header}>
        <Text style={styles.title}>Saved Courses</Text>
        <View style={styles.countBadge}>
          <Text style={styles.countText}>{bookmarkedCourses.length}</Text>
        </View>
      </LinearGradient>

      {bookmarkedCourses.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🔖</Text>
          <Text style={styles.emptyTitle}>No saved courses yet</Text>
          <Text style={styles.emptySubtext}>
            Tap the bookmark icon on any course to save it for later
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarkedCourses}
          keyExtractor={(item: any) => String(item.id)}
          renderItem={({ item, index }) => (
            <CourseCard
              course={item}
              index={index}
              isBookmarked
              onBookmarkToggle={() => toggleBookmark(String(item.id))}
            />
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  header: {
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  title: { color: "#f1f5f9", fontSize: 28, fontWeight: "800" },
  countBadge: {
    backgroundColor: "#6366f1",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 12,
  },
  emptyEmoji: { fontSize: 64, marginBottom: 8 },
  emptyTitle: {
    color: "#94a3b8",
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
  },
  emptySubtext: {
    color: "#475569",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  list: { paddingTop: 16, paddingBottom: 100 },
});
