import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

const NotificationContext = createContext();

const initialNotifications = [
  {
    id: "NOT-1001",
    title: "Claim Documents Required",
    message:
      "Additional documents are required for claim CLM-1001.",
    type: "Claim",
    channel: "In-App",
    status: "Unread",
    target: "/claims/CLM-1001",
    createdAt: "2026-08-13T09:30:00",
  },
  {
    id: "NOT-1002",
    title: "Policy Renewal Reminder",
    message:
      "Your policy POL-2045 will expire in 30 days.",
    type: "Policy",
    channel: "Email",
    status: "Read",
    target: "/policies/POL-2045",
    createdAt: "2026-08-12T15:30:00",
  },
  {
    id: "NOT-1003",
    title: "Claim Status Updated",
    message:
      "Claim CLM-1002 has moved to In Progress.",
    type: "Claim",
    channel: "Push",
    status: "Unread",
    target: "/claims/CLM-1002",
    createdAt: "2026-08-12T11:20:00",
  },
  {
    id: "NOT-1004",
    title: "Payment Confirmation",
    message:
      "Payment for policy POL-2001 was successfully received.",
    type: "Payment",
    channel: "SMS",
    status: "Read",
    target: "/policies/POL-2001",
    createdAt: "2026-08-11T17:10:00",
  },
];

const initialReminders = [
  {
    id: "REM-001",
    name: "Policy Renewal",
    event: "Policy Expiry",
    channel: "Email",
    frequency: "30 days before",
    enabled: true,
  },
  {
    id: "REM-002",
    name: "Claim SLA Warning",
    event: "SLA Threshold",
    channel: "In-App",
    frequency: "When threshold is reached",
    enabled: true,
  },
  {
    id: "REM-003",
    name: "Document Reminder",
    event: "Missing Documents",
    channel: "SMS",
    frequency: "Every 3 days",
    enabled: false,
  },
];

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
  const [notifications, setNotifications] =
    useState(() => {
      const stored = localStorage.getItem(
        "claimcare_notifications"
      );

      return stored
        ? JSON.parse(stored)
        : initialNotifications;
    });

  const [reminders, setReminders] =
    useState(() => {
      const stored = localStorage.getItem(
        "claimcare_reminders"
      );

      return stored
        ? JSON.parse(stored)
        : initialReminders;
    });

  const [preferences, setPreferences] =
    useState(() => {
      const stored = localStorage.getItem(
        "claimcare_notification_preferences"
      );

      return stored
        ? JSON.parse(stored)
        : initialPreferences;
    });

  const [settings, setSettings] =
    useState(() => {
      const stored = localStorage.getItem(
        "claimcare_notification_settings"
      );

      return stored
        ? JSON.parse(stored)
        : initialSettings;
    });

  useEffect(() => {
    localStorage.setItem(
      "claimcare_notifications",
      JSON.stringify(notifications)
    );
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(
      "claimcare_reminders",
      JSON.stringify(reminders)
    );
  }, [reminders]);

  useEffect(() => {
    localStorage.setItem(
      "claimcare_notification_preferences",
      JSON.stringify(preferences)
    );
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem(
      "claimcare_notification_settings",
      JSON.stringify(settings)
    );
  }, [settings]);

  const unreadCount = notifications.filter(
    (item) => item.status === "Unread"
  ).length;

  const markAsRead = (id) => {
    setNotifications((previous) =>
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
    setNotifications((previous) =>
      previous.map((item) => ({
        ...item,
        status: "Read",
      }))
    );
  };

  const deleteNotification = (id) => {
    setNotifications((previous) =>
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