import { useNetwork } from "@/hooks/useNetwork";
import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function OfflineBanner() {
  const { isOffline } = useNetwork();

  if (!isOffline) return null;

  return (
    <View
      style={{
        backgroundColor: "#ef4444",
        paddingVertical: 10,
        paddingHorizontal: 16,
        flexDirection: "row",
        alignItems: "center",
        zIndex: 999,
      }}
    >
      <Ionicons name="wifi-outline" size={18} color="#fff" />
      <Text
        style={{
          color: "#fff",
          fontWeight: "600",
          fontSize: 14,
          marginLeft: 8,
        }}
      >
        No internet connection
      </Text>
    </View>
  );
}
