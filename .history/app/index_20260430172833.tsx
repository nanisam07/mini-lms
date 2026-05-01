import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  StatusBar,
  Animated,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useCourseStore } from "@/store/courseStore";
import { useAuthStore } from "@/store/authStore";
import { CourseCard, CourseCardSkeleton } from "@/components/CourseCard";
import { offlineBanner as OfflineBanner } from "@/components/offlineBanner";

export default function HomeScreen() {
  const { courses, fetchCourses, isLoading, bookmarks, toggleBookmark } =
    useCourseStore();
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const scrollY = new Animated.Value(0);

  useEffect(() => {
    fetchCourses();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCourses();
    setRefreshing(false);
  };

  const filtered = courses.filter((c: any) =>
    c.title?.toLowerCase().includes(search.toLowerCase())
  );

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.96],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <offlineBanner />

      <Animated.View style={{ opacity: headerOpacity }}>
        <LinearGradient
          colors={["#1a1040", "#0f172a"]}
          style={styles.header}
        >
          {/* Top row */}
          <View style={styles.topRow}>
            <View>
              <Text style={styles.greeting}>
                👋 Hey, {user?.username || "Learner"}!
              </Text>
              <Text style={styles.subGreeting}>Ready to learn something new?</Text>
            </View>
            <View style={styles.avatarRing}>
              <LinearGradient
                colors={["#6366f1", "#8b5cf6"]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>
                  {(user?.username || "U")[0].toUpperCase()}
                </Text>
              </LinearGradient>
            </View>
          </View>

          {/* Stats row */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{courses.length}</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{bookmarks.length}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>0</Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
          </View>

          {/* Search */}
          <View style={styles.searchBox}>
            <Text style={styles.searchIcon}>🔍</Text>
            <TextInput
              style={styles.searchInput}
              placeholder="Search courses..."
              placeholderTextColor="#475569"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Text style={styles.clearBtn}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {search ? `Results for "${search}"` : "All Courses"}
        </Text>
        <Text style={styles.sectionCount}>{filtered.length} found</Text>
      </View>

      {/* Course List */}
      <FlatList
        data={isLoading && !refreshing ? [] : filtered}
        keyExtractor={(item: any) => String(item.id)}
        renderItem={({ item, index }) => (
          <CourseCard
            course={item}
            index={index}
            isBookmarked={bookmarks.includes(String(item.id))}
            onBookmarkToggle={() => toggleBookmark(String(item.id))}
          />
        )}
        ListEmptyComponent={
          isLoading ? (
            <View>
              {[0, 1, 2, 3].map((i) => (
                <CourseCardSkeleton key={i} index={i} />
              ))}
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyEmoji}>📭</Text>
              <Text style={styles.emptyText}>No courses found</Text>
              <Text style={styles.emptySubtext}>Try a different search term</Text>
            </View>
          )
        }
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366f1"
            colors={["#6366f1"]}
          />
        }
        contentContainerStyle={styles.listContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  header: {
    paddingTop: 56,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "700",
    color: "#f1f5f9",
  },
  subGreeting: { fontSize: 13, color: "#94a3b8", marginTop: 2 },
  avatarRing: {
    padding: 2,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#6366f1",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  statItem: { flex: 1, alignItems: "center" },
  statNumber: { color: "#6366f1", fontSize: 20, fontWeight: "800" },
  statLabel: { color: "#64748b", fontSize: 11, marginTop: 2 },
  statDivider: {
    width: 1,
    backgroundColor: "#334155",
    marginHorizontal: 8,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#334155",
    gap: 10,
  },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, color: "#f1f5f9", fontSize: 15 },
  clearBtn: { color: "#64748b", fontSize: 14, paddingHorizontal: 4 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  sectionTitle: { color: "#f1f5f9", fontSize: 16, fontWeight: "700" },
  sectionCount: { color: "#6366f1", fontSize: 13, fontWeight: "600" },
  listContent: { paddingBottom: 100 },
  emptyState: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyEmoji: { fontSize: 48, marginBottom: 8 },
  emptyText: { color: "#94a3b8", fontSize: 16, fontWeight: "600" },
  emptySubtext: { color: "#475569", fontSize: 13 },
});