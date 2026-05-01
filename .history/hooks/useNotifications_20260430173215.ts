import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

// ✅ Permission
export async function requestNotificationPermission() {
  if (Platform.OS === "web") return false;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleBookmarkNotification(bookmarkCount: number) {
  if (Platform.OS === "web") return;

  const granted = await requestNotificationPermission();
  if (!granted) return;

  console.log("Bookmark count:", bookmarkCount);

  if (bookmarkCount >= 5) {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "Default",
        importance: Notifications.AndroidImportance.HIGH,
      });
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🎯 Great Collection!",
        body: `You've bookmarked ${bookmarkCount} courses!`,
      },
      trigger: {
        seconds: 2, // ✅ FIXED
      },
      ...(Platform.OS === "android" && {
        channelId: "default",
      }),
    });
  }
}

// ✅ Reminder Notification (FIXED)
export async function scheduleReminderNotification() {
  if (Platform.OS === "web") return;

  const granted = await requestNotificationPermission();
  if (!granted) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("reminders", {
      name: "Reminders",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📚 Miss Learning?",
      body: "Come back and continue your course!",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 10, // 🔥 for testing (change later)
    },
    ...(Platform.OS === "android" && {
      channelId: "reminders",
    }),
  });

  await AsyncStorage.setItem("last_open", new Date().toISOString());
}

// ✅ Hook
export function useNotifications() {
  useEffect(() => {
    if (Platform.OS === "web") return;

    (async () => {
      const granted = await requestNotificationPermission();
      if (granted) {
        await scheduleReminderNotification();
      }
    })();
  }, []);
}
