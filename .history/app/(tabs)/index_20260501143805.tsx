import { CourseCard, CourseCardSkeleton } from "@/components/CourseCard";
import OfflineBanner from "@/components/offlineBanner";
import { useAuthStore } from "@/store/authStore";
import { useCourseStore } from "@/store/courseStore";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  Platform,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const { courses, fetchCourses, isLoading, bookmarks, toggleBookmark } =
    useCourseStore();
  const { user } = useAuthStore();
  const router = useRouter();

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

  // Smooth Header Animations
  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, -20],
    extrapolate: "clamp",
  });

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 150],
    outputRange: [1, 0.8],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <OfflineBanner />

      <Animated.View
        style={[
          styles.headerContainer,
          {
            transform: [{ translateY: headerTranslateY }],
            opacity: headerOpacity,
          },
        ]}
      >
        <LinearGradient
          colors={["#0f172a", "#020617"]}
          style={styles.headerBackground}
        />

        <View style={styles.headerContent}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.greeting}>
                Hello, {user?.username || "Learner"} ✨
              </Text>
              <Text style={styles.subGreeting}>
                Level up your mastery today
              </Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.avatarContainer}
            >
              <LinearGradient
                colors={["#818cf8", "#c084fc"]}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText}>
                  {(user?.username || "U")[0].toUpperCase()}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* New Integrated Stats Design */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>{courses.length}</Text>
              <Text style={styles.statLab}>Courses</Text>
            </View>
            <View style={styles.statDot} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>{bookmarks.length}</Text>
              <Text style={styles.statLab}>Pinned</Text>
            </View>
            <View style={styles.statDot} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>12h</Text>
              <Text style={styles.statLab}>Learning</Text>
            </View>
          </View>

          <View style={styles.searchWrapper}>
            {Platform.OS === "ios" ? (
              <BlurView intensity={20} style={styles.searchBlur}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Find your next skill..."
                  placeholderTextColor="#94a3b8"
                  value={search}
                  onChangeText={setSearch}
                />
              </BlurView>
            ) : (
              <View style={[styles.searchBlur, { backgroundColor: "#1e293b" }]}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Find your next skill..."
                  placeholderTextColor="#94a3b8"
                  value={search}
                  onChangeText={setSearch}
                />
              </View>
            )}
          </View>
        </View>
      </Animated.View>

      <Animated.FlatList
        data={isLoading ? [] : filtered}
        keyExtractor={(item: any) => String(item.id)}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true },
        )}
        contentContainerStyle={styles.listPadding}
        ListHeaderComponent={
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Featured Picks</Text>
            </View>
            <FlatList
              horizontal
              data={courses.slice(0, 5)}
              showsHorizontalScrollIndicator={false}
              snapToInterval={width * 0.75 + 20}
              decelerationRate="fast"
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => router.push(`/course/${item.id}`)}
                  style={styles.featuredCard}
                >
                  <Image
                    source={{
                      uri: `https://picsum.photos/seed/${item.id}/800/400`,
                    }}
                    style={styles.featuredImage}
                  />
                  <LinearGradient
                    colors={["transparent", "rgba(2, 6, 23, 0.9)"]}
                    style={styles.featuredOverlay}
                  >
                    <Text style={styles.featuredTag}>NEW</Text>
                    <Text style={styles.featuredText} numberOfLines={1}>
                      {item.title}
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              style={styles.horizontalList}
            />
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>All Courses</Text>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{filtered.length}</Text>
              </View>
            </View>
          </>
        }
        renderItem={({ item, index }) => (
          <View style={styles.cardContainer}>
            <CourseCard
              course={item}
              index={index}
              isBookmarked={bookmarks.includes(String(item.id))}
              onBookmarkToggle={() => toggleBookmark(String(item.id))}
            />
          </View>
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
            <CourseCardSkeleton index={0} />
          ) : (
            <Text style={styles.emptyText}>No matches found</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#020617" },
  headerContainer: { zIndex: 10, elevation: 5 },
  headerBackground: { ...StyleSheet.absoluteFillObject },
  headerContent: { paddingTop: 60, paddingHorizontal: 24, paddingBottom: 20 },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  greeting: {
    color: "#f8fafc",
    fontSize: 22,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  subGreeting: { color: "#94a3b8", fontSize: 14, marginTop: 2 },

  avatarContainer: {
    padding: 3,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(99, 102, 241, 0.3)",
  },
  avatarGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontWeight: "bold", fontSize: 18 },

  quickStats: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
  },
  statItem: { alignItems: "flex-start" },
  statVal: { color: "#fff", fontSize: 18, fontWeight: "700" },
  statLab: { color: "#64748b", fontSize: 12, fontWeight: "500" },
  statDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#334155",
    marginHorizontal: 20,
  },

  searchWrapper: { marginTop: 5 },
  searchBlur: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "rgba(30, 41, 59, 0.5)",
  },
  searchInput: {
    color: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
  },

  listPadding: { paddingBottom: 100 },
  horizontalList: { paddingLeft: 24, marginBottom: 20 },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  sectionTitle: { color: "#f8fafc", fontSize: 18, fontWeight: "700" },
  badge: {
    backgroundColor: "#6366f120",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  badgeText: { color: "#818cf8", fontSize: 12, fontWeight: "700" },

  featuredCard: {
    width: width * 0.75,
    height: 170,
    marginRight: 16,
    borderRadius: 24,
    overflow: "hidden",
    backgroundColor: "#1e293b",
  },
  featuredImage: { width: "100%", height: "100%" },
  featuredOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    padding: 16,
  },
  featuredTag: {
    backgroundColor: "#6366f1",
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    fontSize: 10,
    fontWeight: "800",
    color: "#fff",
    marginBottom: 8,
  },
  featuredText: { color: "#fff", fontWeight: "700", fontSize: 16 },

  cardContainer: { paddingHorizontal: 20, marginBottom: 12 },
  emptyText: {
    color: "#64748b",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
});
