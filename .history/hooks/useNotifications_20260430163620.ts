import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { useEffect } from "react";
import { Platform } from "react-native";

// How notifications appear when app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: false,
  }),
});

// ✅ Request permission safely
export async function requestNotificationPermission() {
  if (Platform.OS === "web") {
    console.log("⚠️ Must use a physical device for notifications");
    return false;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  return finalStatus === "granted";
}

// ✅ Bookmark milestone notification (fires only once at 5)
export async function scheduleBookmarkNotification(bookmarkCount: number) {
  if (bookmarkCount === 5) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🎯 Great Collection!",
        body: `You've bookmarked ${bookmarkCount} courses! Time to start learning.`,
        data: { type: "bookmark" },
      },
      trigger: null,
    });
  }
}

// ✅ Smart reminder (no duplicate scheduling)
export async function scheduleReminderNotification() {
  const alreadyScheduled = await AsyncStorage.getItem("reminder_set");

  if (alreadyScheduled) return;

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("reminders", {
      name: "Reminders",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "📚 Miss Learning?",
      body: "You haven't opened the app in a while. Continue your courses!",
      data: { type: "reminder" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60 * 60 * 24, // 24 hours
    },
  });

  await AsyncStorage.setItem("reminder_set", "true");
}

// ✅ Hook (safe initialization)
export function useNotifications() {
  useEffect(() => {
    async function init() {
      const granted = await requestNotificationPermission();

      if (granted) {
        await scheduleReminderNotification();
      }
    }

    init();
  }, []);
}

// ✅ Optional: manual trigger (better UX)
export async function enableNotificationsManually() {
  const granted = await requestNotificationPermission();

  if (granted) {
    await scheduleReminderNotification();
  }
}
