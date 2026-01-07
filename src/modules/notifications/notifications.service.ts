import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import { logger } from "@/src/lib/logger";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export interface NotificationPermissionStatus {
  granted: boolean;
  canAskAgain: boolean;
  ios?: {
    status: Notifications.IosAuthorizationStatus;
    allowsAlert: boolean;
    allowsBadge: boolean;
    allowsSound: boolean;
  };
}

export interface LocalNotificationOptions {
  title: string;
  body: string;
  data?: Record<string, unknown>;
  badge?: number;
  sound?: boolean | string;
  categoryIdentifier?: string;
}

export interface ScheduledNotificationOptions extends LocalNotificationOptions {
  trigger: Notifications.NotificationTriggerInput;
}

class NotificationsService {
  private pushToken: string | null = null;

  /**
   * Request notification permissions from the user
   */
  async requestPermissions(): Promise<NotificationPermissionStatus> {
    try {
      if (!Device.isDevice) {
        logger.warn("Notifications only work on physical devices");
        return {
          granted: false,
          canAskAgain: false,
        };
      }

      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      const permissionStatus = await Notifications.getPermissionsAsync();

      return {
        granted: finalStatus === "granted",
        canAskAgain: permissionStatus.canAskAgain,
        ios: permissionStatus.ios
          ? {
              status: permissionStatus.ios.status,
              allowsAlert: permissionStatus.ios.allowsAlert ?? false,
              allowsBadge: permissionStatus.ios.allowsBadge ?? false,
              allowsSound: permissionStatus.ios.allowsSound ?? false,
            }
          : undefined,
      };
    } catch (error) {
      logger.error(error as Error, { context: "notifications.requestPermissions" });
      return {
        granted: false,
        canAskAgain: false,
      };
    }
  }

  /**
   * Get the current notification permission status
   */
  async getPermissionStatus(): Promise<NotificationPermissionStatus> {
    try {
      const permissionStatus = await Notifications.getPermissionsAsync();

      return {
        granted: permissionStatus.granted,
        canAskAgain: permissionStatus.canAskAgain,
        ios: permissionStatus.ios
          ? {
              status: permissionStatus.ios.status,
              allowsAlert: permissionStatus.ios.allowsAlert ?? false,
              allowsBadge: permissionStatus.ios.allowsBadge ?? false,
              allowsSound: permissionStatus.ios.allowsSound ?? false,
            }
          : undefined,
      };
    } catch (error) {
      logger.error(error as Error, { context: "notifications.getPermissionStatus" });
      return {
        granted: false,
        canAskAgain: false,
      };
    }
  }

  /**
   * Register for push notifications and get the Expo push token
   */
  async registerForPushNotifications(): Promise<string | null> {
    try {
      if (!Device.isDevice) {
        logger.warn("Push notifications only work on physical devices");
        return null;
      }

      const { granted } = await this.requestPermissions();

      if (!granted) {
        logger.warn("Push notification permissions not granted");
        return null;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID,
      });

      this.pushToken = tokenData.data;

      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      return this.pushToken;
    } catch (error) {
      logger.error(error as Error, { context: "notifications.registerForPushNotifications" });
      return null;
    }
  }

  /**
   * Get the current push token (if registered)
   */
  getPushToken(): string | null {
    return this.pushToken;
  }

  /**
   * Send a local notification immediately
   */
  async sendLocalNotification(options: LocalNotificationOptions): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: options.title,
          body: options.body,
          data: options.data,
          badge: options.badge,
          sound: options.sound ?? true,
          categoryIdentifier: options.categoryIdentifier,
        },
        trigger: null, // Send immediately
      });

      logger.debug("Local notification sent", { notificationId });
      return notificationId;
    } catch (error) {
      logger.error(error as Error, { context: "notifications.sendLocalNotification", options });
      throw error;
    }
  }

  /**
   * Schedule a local notification for later
   */
  async scheduleNotification(options: ScheduledNotificationOptions): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title: options.title,
          body: options.body,
          data: options.data,
          badge: options.badge,
          sound: options.sound ?? true,
          categoryIdentifier: options.categoryIdentifier,
        },
        trigger: options.trigger,
      });

      logger.debug("Notification scheduled", { notificationId, trigger: options.trigger });
      return notificationId;
    } catch (error) {
      logger.error(error as Error, { context: "notifications.scheduleNotification", options });
      throw error;
    }
  }

  /**
   * Cancel a scheduled notification
   */
  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
      logger.debug("Notification cancelled", { notificationId });
    } catch (error) {
      logger.error(error as Error, { context: "notifications.cancelNotification", notificationId });
    }
  }

  /**
   * Cancel all scheduled notifications
   */
  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
      logger.debug("All notifications cancelled");
    } catch (error) {
      logger.error(error as Error, { context: "notifications.cancelAllNotifications" });
    }
  }

  /**
   * Get all scheduled notifications
   */
  async getAllScheduledNotifications(): Promise<Notifications.NotificationRequest[]> {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      logger.error(error as Error, { context: "notifications.getAllScheduledNotifications" });
      return [];
    }
  }

  /**
   * Set the app badge count (iOS)
   */
  async setBadgeCount(count: number): Promise<void> {
    try {
      await Notifications.setBadgeCountAsync(count);
      logger.debug("Badge count set", { count });
    } catch (error) {
      logger.error(error as Error, { context: "notifications.setBadgeCount", count });
    }
  }

  /**
   * Get the current badge count (iOS)
   */
  async getBadgeCount(): Promise<number> {
    try {
      return await Notifications.getBadgeCountAsync();
    } catch (error) {
      logger.error(error as Error, { context: "notifications.getBadgeCount" });
      return 0;
    }
  }

  /**
   * Dismiss a notification from the notification tray
   */
  async dismissNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.dismissNotificationAsync(notificationId);
      logger.debug("Notification dismissed", { notificationId });
    } catch (error) {
      logger.error(error as Error, {
        context: "notifications.dismissNotification",
        notificationId,
      });
    }
  }

  /**
   * Dismiss all notifications from the notification tray
   */
  async dismissAllNotifications(): Promise<void> {
    try {
      await Notifications.dismissAllNotificationsAsync();
      logger.debug("All notifications dismissed");
    } catch (error) {
      logger.error(error as Error, { context: "notifications.dismissAllNotifications" });
    }
  }

  /**
   * Add a listener for when notifications are received while the app is foregrounded
   */
  addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationReceivedListener(listener);
  }

  /**
   * Add a listener for when a user taps on or interacts with a notification
   */
  addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void
  ): Notifications.Subscription {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }
}

export const notificationsService = new NotificationsService();
