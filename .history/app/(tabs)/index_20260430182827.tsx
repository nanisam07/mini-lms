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
  Image,
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
        <LinearGradient
          colors={["#1a1040", "#0f172a", "#020617"]}
          style={styles.header}
        >
          <View style={styles.topRow}>
            <View>
              <Text style={styles.greeting}>
                👋 Hey, {user?.username || "Learner"}
              </Text>
              <Text style={styles.subGreeting}>
                Let’s upgrade your skills today
              </Text>
            </View>

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
          </View>
        </LinearGradient>
      </Animated.View>

      {/* 🔥 BANNER */}
      <View style={{ marginTop: 10 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {courses.slice(0, 5).map((course, index) => {
            const banner =
              course.thumbnail && course.thumbnail.startsWith("http")
                ? course.thumbnail
                : `https://picsum.photos/800/400?random=${index}`;

            return (
              <TouchableOpacity
                key={course.id}
                onPress={() => router.push(`/course/${course.id}`)}
                style={styles.bannerCard}
              >
                <Image
                  source={{ uri: banner }}
                  style={styles.bannerImage}
                  resizeMode="cover"
                />

                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.9)"]}
                  style={styles.bannerOverlay}
                >
                  <Text style={styles.bannerText} numberOfLines={2}>
                    {course.title}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* SECTION */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Discover</Text>
        <Text style={styles.sectionCount}>{filtered.length}</Text>
      </View>

      {/* LIST */}
      <FlatList
        data={isLoading ? [] : filtered}
        keyExtractor={(item: any) => String(item.id)}
        renderItem={({ item, index }) => (
          <CourseCard
            course={item}
            index={index}
            isBookmarked={bookmarks.includes(String(item.id))}
            onBookmarkToggle={() => {
              toggleBookmark(String(item.id));
            }}
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          isLoading ? (
            <CourseCardSkeleton index={0} />
          ) : (
            <Text style={styles.emptyText}>No courses found</Text>
          )
        }
        contentContainerStyle={{ paddingBottom: 120 }}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },

  header: { paddingTop: 55, paddingHorizontal: 20, paddingBottom: 20 },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  greeting: { color: "#fff", fontSize: 20, fontWeight: "700" },
  subGreeting: { color: "#94a3b8", fontSize: 13 },

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

  statNumber: { color: "#6366f1", fontWeight: "800", fontSize: 18 },
  statLabel: { color: "#64748b", fontSize: 11 },

  divider: { width: 1, backgroundColor: "#334155" },

  searchBox: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 14,
    paddingHorizontal: 14,
    alignItems: "center",
  },

  searchInput: { flex: 1, color: "#fff", paddingVertical: 12 },

  searchIcon: { color: "#64748b", marginRight: 8 },

  bannerCard: {
    width: 300,
    height: 180,
    marginHorizontal: 16,
    borderRadius: 20,
    overflow: "hidden",
  },

  bannerImage: { width: "100%", height: "100%" },

  bannerOverlay: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 12,
  },

  bannerText: { color: "#fff", fontWeight: "700" },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 20,
  },

  sectionTitle: { color: "#fff", fontWeight: "700" },
  sectionCount: { color: "#6366f1" },

  emptyText: { color: "#64748b", textAlign: "center", marginTop: 50 },
});
