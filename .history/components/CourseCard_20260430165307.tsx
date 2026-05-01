import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 32;

interface CourseCardProps {
  course: {
    id: string | number;
    title: string;
    description?: string;
    thumbnail?: string;
    category?: string;
    rating?: number;
    price?: number;
  };
  isBookmarked?: boolean;
  onBookmarkToggle?: () => void;
  index?: number;
}

export function CourseCard({
  course,
  isBookmarked,
  onBookmarkToggle,
  index = 0,
}: CourseCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handlePress = () => router.push(`/course/${course.id}`);

  const categoryColors = {
    Electronics: ["#6366f1", "#8b5cf6"] as const,
    Clothing: ["#ec4899", "#f43f5e"] as const,
    Accessories: ["#f59e0b", "#f97316"] as const,
    Jewelry: ["#10b981", "#06b6d4"] as const,
  } as const;

  const gradientColors = categoryColors[course.category as keyof typeof categoryColors] || [
    "#6366f1",
    "#8b5cf6",
  ] as const;

  return (
    <Animated.View
      style={[
        styles.wrapper,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.92}
        style={styles.card}
      >
        {/* Thumbnail */}
        <View style={styles.imageContainer}>
          {course.thumbnail ? (
            <Image source={{ uri: course.thumbnail }} style={styles.image} />
          ) : (
            <LinearGradient
              colors={gradientColors}
              style={styles.imagePlaceholder}
            >
              <Text style={styles.placeholderEmoji}>📚</Text>
            </LinearGradient>
          )}
          {/* Category badge */}
          {course.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{course.category}</Text>
            </View>
          )}
        </View>

        {/* Content */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {course.title}
          </Text>
          {course.description && (
            <Text style={styles.description} numberOfLines={2}>
              {course.description}
            </Text>
          )}

          <View style={styles.footer}>
            {/* Rating */}
            <View style={styles.ratingRow}>
              <Text style={styles.star}>★</Text>
              <Text style={styles.ratingText}>
                {course.rating?.toFixed(1) || "4.5"}
              </Text>
            </View>

            {/* Price */}
            <View style={styles.priceRow}>
              <Text style={styles.price}>
                {course.price ? `$${course.price}` : "Free"}
              </Text>
            </View>

            {/* Bookmark */}
            <TouchableOpacity
              onPress={onBookmarkToggle}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Text
                style={[
                  styles.bookmarkIcon,
                  isBookmarked && styles.bookmarkActive,
                ]}
              >
                {isBookmarked ? "🔖" : "🏷️"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Glow border */}
        <View style={styles.glowBorder} />
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Skeleton Card ───────────────────────────────────────────────────────────

export function CourseCardSkeleton({ index = 0 }: { index?: number }) {
  const shimmer = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmer, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmer, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);

  const opacity = shimmer.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0.9],
  });

  return (
    <View style={[styles.wrapper, styles.skeletonCard]}>
      <Animated.View style={[styles.skeletonImage, { opacity }]} />
      <View style={styles.content}>
        <Animated.View
          style={[styles.skeletonLine, { width: "80%", opacity }]}
        />
        <Animated.View
          style={[styles.skeletonLine, { width: "60%", marginTop: 8, opacity }]}
        />
        <Animated.View
          style={[
            styles.skeletonLine,
            { width: "40%", marginTop: 16, height: 10, opacity },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#334155",
    shadowColor: "#6366f1",
    shadowOpacity: 0.15,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  glowBorder: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: "#6366f130",
  },
  imageContainer: { position: "relative" },
  image: { width: "100%", height: 160, resizeMode: "cover" },
  imagePlaceholder: {
    width: "100%",
    height: 160,
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderEmoji: { fontSize: 48 },
  categoryBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    backgroundColor: "#0f172aCC",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#6366f150",
  },
  categoryText: { color: "#a5b4fc", fontSize: 11, fontWeight: "600" },
  content: { padding: 16 },
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: "#f1f5f9",
    lineHeight: 22,
    marginBottom: 6,
  },
  description: {
    fontSize: 13,
    color: "#94a3b8",
    lineHeight: 18,
    marginBottom: 12,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", gap: 3 },
  star: { color: "#f59e0b", fontSize: 14 },
  ratingText: { color: "#fcd34d", fontSize: 13, fontWeight: "600" },
  priceRow: { flex: 1 },
  price: { color: "#6366f1", fontSize: 14, fontWeight: "700" },
  bookmarkIcon: { fontSize: 18, opacity: 0.5 },
  bookmarkActive: { opacity: 1 },

  // Skeleton styles
  skeletonCard: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#334155",
  },
  skeletonImage: {
    width: "100%",
    height: 160,
    backgroundColor: "#334155",
  },
  skeletonLine: {
    height: 14,
    backgroundColor: "#334155",
    borderRadius: 7,
  },
});
