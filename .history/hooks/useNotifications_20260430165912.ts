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

export async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

export async function scheduleBookmarkNotification(bookmarkCount: number) {
  if (bookmarkCount >= 5) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "🎯 Great Collection!",
        body: `You've bookmarked ${bookmarkCount} courses! Time to start learning.`,
        data: { type: "bookmark" },
      },
      trigger: null, // show immediately
    });
  }
}

export async function scheduleReminderNotification() {
  // Cancel existing reminders first
  await Notifications.cancelAllScheduledNotificationsAsync();

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("reminders", {
      name: "Reminders",
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  await AsyncStorage.setItem("last_open", new Date().toISOString());
}

export function useNotifications() {
  useEffect(() => {
    requestNotificationPermission();
    scheduleReminderNotification();
  }, []);
}
