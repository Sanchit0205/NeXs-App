// utils/notificationHelper.ts

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler (optional, for foreground behavior)
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function scheduleNotification(title: string, body: string, date: Date) {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.HIGH,
    });
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
    },
    trigger: {
      date,
    },
  });
}
