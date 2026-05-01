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
        seconds: 2,
      } as Notifications.TimeIntervalTriggerInput,
      ...(Platform.OS === "android" && {
        channelId: "default",
      }),
    });
  }
}

// ✅ Reminder Notification (FIXED)
export async function scheduleReminderNotification() {
  if (Platform.OS === "web") return;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("reminders", {
      name: "Reminders",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📚 Come back!",
      body: "Continue your learning journey 🚀",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 10, // for testing
      repeats: false,
    },
  });
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
