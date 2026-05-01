import { useNetwork } from "@/hooks/useNetwork";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";

const { width } = Dimensions.get("window");

export default function OfflineBanner() {
  const { isOffline } = useNetwork();
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    Animated.spring(slideAnim, {
      toValue: isOffline ? 60 : -100, // Positions it below the notch/header
      useNativeDriver: true,
      friction: 8,
      tension: 40,
    }).start();
  }, [isOffline]);

  return (
    <Animated.View
      style={[styles.container, { transform: [{ translateY: slideAnim }] }]}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="cloud-offline" size={16} color="#FF3B30" />
        </View>
        <View style={styles.textStack}>
          <Text style={styles.title}>Offline Mode</Text>
          <Text style={styles.subtitle}>Check your connection</Text>
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignSelf: "center",
    zIndex: 9999,
    width: width * 0.85,
    // Premium Shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  content: {
    backgroundColor: "rgba(255, 255, 255, 0.92)", // Semi-transparent glass effect
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.5)", // Inner "shine" border
  },
  iconContainer: {
    backgroundColor: "rgba(255, 59, 48, 0.1)",
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  textStack: {
    flexDirection: "column",
  },
  title: {
    color: "#1C1C1E",
    fontWeight: "700",
    fontSize: 14,
    letterSpacing: -0.2,
  },
  subtitle: {
    color: "#8E8E93",
    fontSize: 11,
    fontWeight: "500",
    marginTop: 1,
  },
});
