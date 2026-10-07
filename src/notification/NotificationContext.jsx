import { useRecords } from "../data/useRecords";
import { useProfileSetting } from "../backend/useProfileSetting";
import {
  createContext,
  useContext,
} from "react";

const NotificationContext = createContext();

const initialPreferences = {
  email: true,
  sms: true,
  push: true,
  inApp: true,
};

const initialSettings = {
  emailEnabled: true,
  smsEnabled: true,
  pushEnabled: true,
  inAppEnabled: true,
  defaultFrequency: "Immediately",
  quietHours: false,
  quietStart: "22:00",
  quietEnd: "07:00",
};

function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useRecords("notifications", true);

  const [reminders, setReminders] = useRecords("reminders", true);

  const [preferences, setPreferences] = useProfileSetting("notification_preferences", initialPreferences);

  const [settings, setSettings] = useProfileSetting("notification_settings", initialSettings);

  const unreadCount = notifications.filter(
    (item) => item.status === "Unread"
  ).length;

  const markAsRead = (id) => {
    return setNotifications((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              status: "Read",
            }
          : item
      )
    );
  };

  const markAllAsRead = () => {
    return setNotifications((previous) =>
      previous.map((item) => ({
        ...item,
        status: "Read",
      }))
    );
  };

  const deleteNotification = (id) => {
    return setNotifications((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );
  };

  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      id: `NOT-${Date.now()}`,
      status: "Unread",
      createdAt: new Date().toISOString(),
    };

    setNotifications((previous) => [
      newNotification,
      ...previous,
    ]);
  };

  const updatePreference = (
    channel,
    enabled
  ) => {
    setPreferences((previous) => ({
      ...previous,
      [channel]: enabled,
    }));
  };

  const updateReminder = (
    id,
    data
  ) => {
    setReminders((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
              ...item,
              ...data,
            }
          : item
      )
    );
  };

  const addReminder = (reminder) => {
    setReminders((previous) => [
      ...previous,
      {
        ...reminder,
        id: `REM-${Date.now()}`,
      },
    ]);
  };

  const deleteReminder = (id) => {
    setReminders((previous) =>
      previous.filter(
        (item) => item.id !== id
      )
    );
  };

  const updateSettings = (data) => {
    setSettings((previous) => ({
      ...previous,
      ...data,
    }));
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        reminders,
        preferences,
        settings,
        unreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        addNotification,
        updatePreference,
        updateReminder,
        addReminder,
        deleteReminder,
        updateSettings,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  return useContext(NotificationContext);
}

export default NotificationProvider;
