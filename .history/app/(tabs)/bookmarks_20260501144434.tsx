import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  FlatList,
  Platform,
  StyleSheet,
  Text,
  View
} from "react-native";
import { CourseCard } from "../../components/CourseCard";
import { useCourseStore } from "../../store/courseStore";

export default function BookmarksScreen() {
  const { courses, bookmarks, toggleBookmark } = useCourseStore();

  const bookmarkedCourses = courses.filter((c: any) =>
    bookmarks.includes(String(c.id)),
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* 🧊 GLASSMORPHIC HEADER */}
      <View style={styles.headerWrapper}>
        <LinearGradient
          colors={["#1e1b4b", "transparent"]}
          style={StyleSheet.absoluteFill}
        />
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>Library</Text>
            <Text style={styles.subtitle}>Your curated collection</Text>
          </View>
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{bookmarkedCourses.length}</Text>
          </View>
        </View>
      </View>

      {bookmarkedCourses.length === 0 ? (
        <View style={styles.emptyState}>
          <View style={styles.emptyIconCircle}>
            <Ionicons name="bookmark-outline" size={40} color="#6366f1" />
          </View>
          <Text style={styles.emptyTitle}>Your library is empty</Text>
          <Text style={styles.emptySubtext}>
            Save courses you're interested in and they'll appear here for quick
            access.
          </Text>
        </View>
      ) : (
        <FlatList
          data={bookmarkedCourses}
          keyExtractor={(item: any) => String(item.id)}
          // itemLayoutAnimation makes the list slide when items are removed
          itemLayoutAnimation={null}
          renderItem={({ item, index }) => (
            <View style={styles.cardWrapper}>
              <CourseCard
                course={item}
                index={index}
                isBookmarked
                onBookmarkToggle={() => toggleBookmark(String(item.id))}
              />
            </View>
          )}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },

  headerWrapper: {
    paddingTop: Platform.OS === "ios" ? 60 : 40,
    paddingBottom: 24,
    zIndex: 10,
  },
  headerContent: {
    paddingHorizontal: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    letterSpacing: -1,
  },
  subtitle: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "500",
    marginTop: -2,
  },
  countBadge: {
    backgroundColor: "rgba(99, 102, 241, 0.15)",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.3)",
  },
  countText: { color: "#818cf8", fontWeight: "800", fontSize: 16 },

  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 50,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#1e1b4b",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#312e81",
  },
  emptyTitle: {
    color: "#f8fafc",
    fontSize: 20,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  emptySubtext: {
    color: "#64748b",
    fontSize: 15,
    textAlign: "center",
    lineHeight: 22,
  },

  list: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 100,
  },
  cardWrapper: {
    marginBottom: 16,
    // Add shadow/glow for iOS if the card is transparent
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
  },
});
