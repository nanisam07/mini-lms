import { CourseCard, CourseCardSkeleton } from "@/components/CourseCard";
import OfflineBanner from "@/components/offlineBanner";
import { useAuthStore } from "@/store/authStore";
import { useCourseStore } from "@/store/courseStore";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const { courses, fetchCourses, isLoading, bookmarks, toggleBookmark } =
    useCourseStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const { width } = Dimensions.get("window");
  const bannerRef = useRef<ScrollView>(null);
  const [bannerIndex, setBannerIndex] = useState(0);
  useEffect(() => {
    if (!courses.length) return;

    const interval = setInterval(() => {
      const nextIndex = (bannerIndex + 1) % Math.min(courses.length, 5);

      bannerRef.current?.scrollTo({
        x: nextIndex * (width - 40),
        animated: true,
      });

      setBannerIndex(nextIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [bannerIndex, courses]);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const scrollY = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fetchCourses();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCourses();
    setRefreshing(false);
  };

  const filtered = courses.filter((c: any) =>
    c.title?.toLowerCase().includes(search.toLowerCase()),
  );

  const headerScale = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.96],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <OfflineBanner />

      {/* 🔥 HEADER */}
      <Animated.View style={{ transform: [{ scale: headerScale }] }}>
        <LinearGradient colors={["#1a1040", "#0f172a"]} style={styles.header}>
          {/* Greeting */}
          <View style={styles.topRow}>
            <View>
              <Text style={styles.greeting}>
                👋 Hey, {user?.username || "Learner"}
              </Text>
              <Text style={styles.subGreeting}>
                Let’s upgrade your skills today
              </Text>
            </View>

            {/* Avatar */}
            <View style={styles.avatarWrapper}>
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

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{courses.length}</Text>
              <Text style={styles.statLabel}>Courses</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.stat}>
              <Text style={styles.statNumber}>{bookmarks.length}</Text>
              <Text style={styles.statLabel}>Saved</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.stat}>
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
              placeholderTextColor="#64748b"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Text style={styles.clear}>✕</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </Animated.View>

      {/* Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {search ? `Results for "${search}"` : "Discover"}
        </Text>
        <Text style={styles.sectionCount}>{filtered.length}</Text>
      </View>

      {/* LIST */}
      <FlatList
        data={isLoading && !refreshing ? [] : filtered}
        keyExtractor={(item: any) => String(item.id)}
        renderItem={({ item, index }) => (
          <CourseCard
            course={item}
            index={index}
            isBookmarked={bookmarks.includes(String(item.id))}
            onBookmarkToggle={() => {
              const id = String(item.id);
              const wasBookmarked = bookmarks.includes(id);

              toggleBookmark(id);

              const updatedCount = wasBookmarked
                ? bookmarks.length - 1
                : bookmarks.length + 1;

              // 🔥 Notification trigger (IMPORTANT)
              import("@/hooks/useNotifications").then((mod) =>
                mod.scheduleBookmarkNotification(updatedCount),
              );
            }}
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#6366f1"
          />
        }
        ListEmptyComponent={
          isLoading ? (
            <View>
              {[0, 1, 2].map((i) => (
                <CourseCardSkeleton key={i} index={i} />
              ))}
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyText}>No courses found</Text>
            </View>
          )
        }
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },

  header: {
    paddingTop: 55,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  greeting: {
    color: "#f1f5f9",
    fontSize: 20,
    fontWeight: "700",
  },

  subGreeting: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 4,
  },

  avatarWrapper: {
    borderWidth: 2,
    borderColor: "#6366f1",
    borderRadius: 24,
    padding: 2,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: { color: "#fff", fontWeight: "700" },

  statsRow: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 14,
    marginBottom: 16,
  },

  stat: { flex: 1, alignItems: "center" },

  statNumber: {
    color: "#6366f1",
    fontSize: 18,
    fontWeight: "800",
  },

  statLabel: { color: "#64748b", fontSize: 11 },

  divider: {
    width: 1,
    backgroundColor: "#334155",
  },

  searchBox: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 14,
    paddingHorizontal: 14,
    alignItems: "center",
  },

  searchIcon: { color: "#64748b", marginRight: 8 },

  searchInput: {
    flex: 1,
    color: "#f1f5f9",
    paddingVertical: 12,
  },

  clear: { color: "#64748b" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },

  sectionTitle: {
    color: "#f1f5f9",
    fontWeight: "700",
  },

  sectionCount: {
    color: "#6366f1",
    fontWeight: "600",
  },

  empty: { alignItems: "center", marginTop: 50 },

  emptyText: { color: "#64748b" },
});
