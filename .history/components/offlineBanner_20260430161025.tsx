import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Text } from "react-native";
import { useNetwork } from "@/hooks/useNetwork";

export default function OfflineBanner() {
  const { isOffline } = useNetwork();
  const slideAnim = useRef(new Animated.Value(-60)).current;

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isOffline ? 0 : -60,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOffline]);

  if (!isOffline) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 999,
        transform: [{ translateY: slideAnim }],
        backgroundColor: "#ef4444",
        paddingVertical: 10,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <Ionicons name="wifi-outline" size={18} color="#fff" />
      <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14, marginLeft: 8 }}>
        No internet connection
      </Text>
    </Animated.View>
  );
}