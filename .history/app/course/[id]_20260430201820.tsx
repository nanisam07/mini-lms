import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useCourseStore } from "../../store/courseStore";
const localBanners = [
  require("../../assets/banner/banner1.png"),
  require("../../assets/banner/banner2.png"),
  require("../../assets/banner/banner3.png"),
  require("../../assets/banner/banner4.png"),
  require("../../assets/banner/banner5.png"),
];
export default function CourseDetailScreen() {
  const { id } = useLocalSearchParams();
  const { courses, bookmarks, toggleBookmark } = useCourseStore();
  const course = courses.find((c: any) => String(c.id) === String(id));
  const isBookmarked = bookmarks.includes(String(id));
  const bannerIndex = course ? Number(course.id) % localBanners.length : 0;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 60,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  if (!course) {
    return (
      <View style={styles.notFound}>
        <Text style={styles.notFoundText}>Course not found</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>← Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleEnroll = () => {
    router.push({
      pathname: "/webview",
      params: { url: course.url || "https://freeapi.app", title: course.title },
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          {course.thumbnail ? (
            <Image
              source={localBanners[bannerIndex]}
              style={{ width: "100%", height: 220 }}
              resizeMode="cover"
            />
          ) : (
            <LinearGradient
              colors={["#6366f1", "#8b5cf6", "#ec4899"]}
              style={styles.heroPlaceholder}
            >
              <Text style={styles.heroEmoji}>📚</Text>
            </LinearGradient>
          )}
          <LinearGradient
            colors={["transparent", "#0f172a"]}
            style={styles.heroOverlay}
          />
          {/* Back button */}
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <View style={styles.backButtonInner}>
              <Text style={styles.backButtonText}>←</Text>
            </View>
          </TouchableOpacity>
          {/* Bookmark button */}
          <TouchableOpacity
            onPress={() => toggleBookmark(String(id))}
            style={styles.bookmarkButton}
          >
            <View
              style={[
                styles.backButtonInner,
                isBookmarked && styles.bookmarkActive,
              ]}
            >
              <Text style={styles.backButtonText}>
                {isBookmarked ? "🔖" : "🏷️"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Animated.View
          style={[
            styles.body,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {/* Category */}
          {course.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{course.category}</Text>
            </View>
          )}

          {/* Title */}
          <Text style={styles.title}>{course.title}</Text>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statEmoji}>★</Text>
              <Text style={styles.statValue}>
                {course.rating?.toFixed(1) || "4.5"}
              </Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statEmoji}>👥</Text>
              <Text style={styles.statValue}>1.2k</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statEmoji}>🕐</Text>
              <Text style={styles.statValue}>8h</Text>
              <Text style={styles.statLabel}>Duration</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statEmoji}>📶</Text>
              <Text style={styles.statValue}>Beginner</Text>
              <Text style={styles.statLabel}>Level</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About this course</Text>
            <Text style={styles.description}>
              {course.description ||
                "Master the fundamentals and advanced concepts in this comprehensive course. Learn at your own pace with hands-on projects and expert guidance."}
            </Text>
          </View>

          {/* What you'll learn */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What you'll learn</Text>
            {[
              "Core concepts and fundamentals",
              "Hands-on practical projects",
              "Industry best practices",
              "Real-world applications",
            ].map((item, i) => (
              <View key={i} style={styles.learnItem}>
                <View style={styles.checkDot}>
                  <Text style={styles.checkIcon}>✓</Text>
                </View>
                <Text style={styles.learnText}>{item}</Text>
              </View>
            ))}
          </View>

          {/* Instructor */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Instructor</Text>
            <View style={styles.instructorCard}>
              <LinearGradient
                colors={["#6366f1", "#8b5cf6"]}
                style={styles.instructorAvatar}
              >
                <Text style={styles.instructorInitial}>J</Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text style={styles.instructorName}>John Smith</Text>
                <Text style={styles.instructorRole}>
                  Senior Developer & Educator
                </Text>
                <Text style={styles.instructorStats}>
                  ⭐ 4.9 · 12k students · 15 courses
                </Text>
              </View>
            </View>
          </View>

          {/* Price */}
          <View style={styles.priceSection}>
            <Text style={styles.priceLabel}>Course Price</Text>
            <Text style={styles.priceValue}>
              {course.price ? `$${course.price}` : "Free"}
            </Text>
          </View>

          {/* Spacer for button */}
          <View style={{ height: 100 }} />
        </Animated.View>
      </ScrollView>

      {/* Fixed Enroll Button */}
      <View style={styles.enrollContainer}>
        <TouchableOpacity onPress={handleEnroll} activeOpacity={0.85}>
          <LinearGradient
            colors={["#6366f1", "#8b5cf6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.enrollButton}
          >
            <Text style={styles.enrollText}>🚀 Enroll Now</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  notFound: {
    flex: 1,
    backgroundColor: "#0f172a",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  notFoundText: { color: "#94a3b8", fontSize: 16 },
  backBtn: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backBtnText: { color: "#6366f1", fontWeight: "600" },
  heroContainer: { height: 280, position: "relative" },
  heroImage: { width: "100%", height: 280, resizeMode: "cover" },
  heroPlaceholder: {
    width: "100%",
    height: 280,
    alignItems: "center",
    justifyContent: "center",
  },
  heroEmoji: { fontSize: 80 },
  heroOverlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 140,
  },
  backButton: { position: "absolute", top: 52, left: 16 },
  backButtonInner: {
    backgroundColor: "#0f172aCC",
    borderRadius: 20,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  backButtonText: { color: "#f1f5f9", fontSize: 18 },
  bookmarkButton: { position: "absolute", top: 52, right: 16 },
  bookmarkActive: { backgroundColor: "#6366f1CC", borderColor: "#6366f1" },
  body: { padding: 20, marginTop: -20 },
  categoryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#6366f120",
    borderWidth: 1,
    borderColor: "#6366f150",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginBottom: 12,
  },
  categoryText: { color: "#a5b4fc", fontSize: 12, fontWeight: "600" },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#f1f5f9",
    lineHeight: 32,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#334155",
  },
  stat: { flex: 1, alignItems: "center", gap: 2 },
  statEmoji: { fontSize: 14 },
  statValue: { color: "#f1f5f9", fontSize: 13, fontWeight: "700" },
  statLabel: { color: "#64748b", fontSize: 10 },
  statDivider: { width: 1, backgroundColor: "#334155" },
  section: { marginBottom: 24 },
  sectionTitle: {
    color: "#f1f5f9",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 12,
  },
  description: { color: "#94a3b8", fontSize: 14, lineHeight: 22 },
  learnItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 10,
  },
  checkDot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#6366f120",
    borderWidth: 1,
    borderColor: "#6366f1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkIcon: { color: "#6366f1", fontSize: 11, fontWeight: "700" },
  learnText: { flex: 1, color: "#94a3b8", fontSize: 14, lineHeight: 20 },
  instructorCard: {
    flexDirection: "row",
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    gap: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  instructorAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: "center",
    justifyContent: "center",
  },
  instructorInitial: { color: "#fff", fontSize: 22, fontWeight: "700" },
  instructorName: { color: "#f1f5f9", fontSize: 15, fontWeight: "700" },
  instructorRole: { color: "#94a3b8", fontSize: 12, marginTop: 2 },
  instructorStats: { color: "#64748b", fontSize: 12, marginTop: 4 },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#334155",
  },
  priceLabel: { color: "#94a3b8", fontSize: 14 },
  priceValue: { color: "#6366f1", fontSize: 24, fontWeight: "800" },
  enrollContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#0f172aEE",
    borderTopWidth: 1,
    borderTopColor: "#1e293b",
  },
  enrollButton: {
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#6366f1",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  enrollText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 17,
    letterSpacing: 0.5,
  },
});
