import { Link } from "react-router-dom";
import { useNotification } from "./NotificationContext";

function NotificationDashboard() {
  const {
    notifications,
    reminders,
    unreadCount,
  } = useNotification();

  const emailCount = notifications.filter(
    (item) => item.channel === "Email"
  ).length;

  const smsCount = notifications.filter(
    (item) => item.channel === "SMS"
  ).length;

  const pushCount = notifications.filter(
    (item) => item.channel === "Push"
  ).length;

  return (
    <main className="notification-page">
      <div className="notification-container">

        <div className="notification-header">
          <div>
            <span className="notification-badge">
              NOTIFICATION CENTER
            </span>

            <h1>Notification Center</h1>

            <p>
              Manage notifications, reminders,
              channels and notification preferences.
            </p>
          </div>
        </div>

        <div className="notification-summary">

          <div className="notification-summary-card">
            <span>UNREAD</span>
            <strong>{unreadCount}</strong>
            <small>Unread notifications</small>
          </div>

          <div className="notification-summary-card">
            <span>EMAIL</span>
            <strong>{emailCount}</strong>
            <small>Email notifications</small>
          </div>

          <div className="notification-summary-card">
            <span>SMS</span>
            <strong>{smsCount}</strong>
            <small>SMS notifications</small>
          </div>

          <div className="notification-summary-card">
            <span>PUSH</span>
            <strong>{pushCount}</strong>
            <small>Push notifications</small>
          </div>

        </div>

        <section className="notification-module-grid">

          <Link
            to="/notifications/list"
            className="notification-module-card"
          >
            <div className="notification-module-icon">
              🔔
            </div>

            <span>NOT-04</span>

            <h3>Notifications</h3>

            <p>
              View unread and read notifications
              with target links.
            </p>

            <strong>→</strong>
          </Link>

          <Link
            to="/notifications/preferences"
            className="notification-module-card"
          >
            <div className="notification-module-icon">
              📬
            </div>

            <span>NOT-06</span>

            <h3>Channel Preferences</h3>

            <p>
              Choose how notifications should
              reach you.
            </p>

            <strong>→</strong>
          </Link>

          <Link
            to="/notifications/reminders"
            className="notification-module-card"
          >
            <div className="notification-module-icon">
              ⏰
            </div>

            <span>NOT-05</span>

            <h3>Reminder Engine</h3>

            <p>
              Configure reminders for supported
              events.
            </p>

            <strong>→</strong>
          </Link>

          <Link
            to="/notifications/channels"
            className="notification-module-card"
          >
            <div className="notification-module-icon">
              📡
            </div>

            <span>NOT-01 → NOT-03</span>

            <h3>Notification Channels</h3>

            <p>
              Configure Email, SMS, Push and
              In-App channels.
            </p>

            <strong>→</strong>
          </Link>

          <Link
            to="/notifications/history"
            className="notification-module-card"
          >
            <div className="notification-module-icon">
              🕘
            </div>

            <span>HISTORY</span>

            <h3>Notification History</h3>

            <p>
              Review previous notification
              activity.
            </p>

            <strong>→</strong>
          </Link>

          <Link
            to="/notifications/settings"
            className="notification-module-card"
          >
            <div className="notification-module-icon">
              ⚙️
            </div>

            <span>NOT-07</span>

            <h3>Notification Settings</h3>

            <p>
              Configure frequency and quiet
              hour settings.
            </p>

            <strong>→</strong>
          </Link>

        </section>

        <section className="notification-card">

          <div className="notification-card-header">
            <div>
              <span>RECENT ACTIVITY</span>
              <h2>Latest Notifications</h2>
            </div>

            <Link
              to="/notifications/list"
              className="notification-link-button"
            >
              View All
            </Link>
          </div>

          <div className="notification-mini-list">

            {notifications
              .slice(0, 5)
              .map((item) => (
                <div
                  key={item.id}
                  className="notification-mini-item"
                >
                  <div>
                    <strong>
                      {item.title}
                    </strong>

                    <small>
                      {item.channel} ·{" "}
                      {item.type}
                    </small>
                  </div>

                  <span
                    className={`notification-status ${
                      item.status === "Unread"
                        ? "unread"
                        : "read"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              ))}

          </div>

        </section>

        <section className="notification-card">

          <div className="notification-card-header">
            <div>
              <span>REMINDER ENGINE</span>
              <h2>Active Reminders</h2>
            </div>
          </div>

          <div className="notification-mini-list">

            {reminders
              .filter(
                (item) => item.enabled
              )
              .map((item) => (
                <div
                  key={item.id}
                  className="notification-mini-item"
                >
                  <div>
                    <strong>
                      {item.name}
                    </strong>

                    <small>
                      {item.event} ·{" "}
                      {item.frequency}
                    </small>
                  </div>

                  <span className="notification-status enabled">
                    Enabled
                  </span>
                </div>
              ))}

          </div>

        </section>

      </div>
    </main>
  );
}

export default NotificationDashboard;