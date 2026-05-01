import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient"; // Ensure expo-linear-gradient is installed
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width } = Dimensions.get("window");

const localBanners = [
  require("../assets/banner/banner1.png"),
  require("../assets/banner/banner2.png"),
  // ... rest of your banners
];

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
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        friction: 8,
        tension: 40,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onPressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
    }).start();
  };
  const onPressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }).start();
  };

  const handlePress = () => router.push(`/course/${course.id}`);

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
        },
      ]}
    >
      <TouchableOpacity
        onPress={handlePress}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        activeOpacity={1}
        style={styles.card}
      >
        {/* Image Section */}
        <View style={styles.imageContainer}>
          <Image
            source={localBanners[index % localBanners.length]}
            style={styles.image}
          />

          {/* Subtle Overlay Gradient for text readability */}
          <LinearGradient
            colors={["transparent", "rgba(15, 23, 42, 0.8)"]}
            style={styles.imageGradient}
          />

          {/* Floating Bookmark Button */}
          <TouchableOpacity
            onPress={onBookmarkToggle}
            activeOpacity={0.7}
            style={styles.floatingBookmark}
          >
            <View
              style={[styles.glassIcon, isBookmarked && styles.activeGlass]}
            >
              <Ionicons
                name={isBookmarked ? "bookmark" : "bookmark-outline"}
                size={20}
                color={isBookmarked ? "#6366f1" : "#fff"}
              />
            </View>
          </TouchableOpacity>

          {/* Category Chip */}
          {course.category && (
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>
                {course.category.toUpperCase()}
              </Text>
            </View>
          )}
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Text style={styles.title} numberOfLines={1}>
              {course.title}
            </Text>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={12} color="#F59E0B" />
              <Text style={styles.ratingText}>
                {course.rating?.toFixed(1) || "4.8"}
              </Text>
            </View>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {course.description ||
              "Master the art of design and development with this premium curated course."}
          </Text>

          <View style={styles.footer}>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price</Text>
              <Text style={styles.priceText}>
                {course.price ? `$${course.price}` : "Premium"}
              </Text>
            </View>

            <View style={styles.actionButton}>
              <Text style={styles.actionText}>View Detail</Text>
              <Ionicons name="arrow-forward" size={14} color="#6366f1" />
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

// ─── Styles ──────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  wrapper: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#1E293B",
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 0.3,
        shadowRadius: 16,
      },
      android: { elevation: 12 },
    }),
  },
  imageContainer: {
    height: 180,
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  imageGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  floatingBookmark: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
  },
  glassIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(15, 23, 42, 0.5)",
    backdropFilter: "blur(10px)", // Works on web/some platforms
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  activeGlass: {
    backgroundColor: "#fff",
    borderColor: "#6366f1",
  },
  categoryBadge: {
    position: "absolute",
    bottom: 15,
    left: 15,
    backgroundColor: "#6366f1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  content: {
    padding: 20,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#F8FAFC",
    flex: 1,
    marginRight: 10,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(245, 158, 11, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  ratingText: {
    color: "#F59E0B",
    fontSize: 12,
    fontWeight: "700",
  },
  description: {
    fontSize: 13,
    color: "#94A3B8",
    lineHeight: 20,
    marginBottom: 20,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.05)",
    paddingTop: 15,
  },
  priceContainer: {
    flexDirection: "column",
  },
  priceLabel: {
    color: "#64748B",
    fontSize: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  priceText: {
    color: "#F8FAFC",
    fontSize: 16,
    fontWeight: "800",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  actionText: {
    color: "#6366f1",
    fontWeight: "700",
    fontSize: 14,
  },
});
