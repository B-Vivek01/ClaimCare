import { Link } from "react-router-dom";
import { useNotification } from "./NotificationContext";

function NotificationChannels() {
  const {
    settings,
    updateSettings,
  } = useNotification();

  return (
    <main className="notification-page">
      <div className="notification-container">

        <div className="notification-header">

          <div>
            <span className="notification-badge">
              NOT-01 → NOT-03
            </span>

            <h1>
              Notification Channels
            </h1>

            <p>
              Configure available notification
              delivery channels.
            </p>
          </div>

          <Link
            to="/notifications"
            className="notification-secondary-button"
          >
            ← Notification Center
          </Link>

        </div>

        <section className="notification-card">

          <div className="notification-card-header">
            <div>
              <span>
                CHANNEL STATUS
              </span>

              <h2>
                Supported Channels
              </h2>
            </div>
          </div>

          <div className="notification-channel-grid">

            <ChannelCard
              icon="✉️"
              title="Email"
              description="Email-based notification delivery."
              enabled={
                settings.emailEnabled
              }
              onChange={(value) =>
                updateSettings({
                  emailEnabled: value,
                })
              }
            />

            <ChannelCard
              icon="📱"
              title="SMS"
              description="SMS notification delivery."
              enabled={
                settings.smsEnabled
              }
              onChange={(value) =>
                updateSettings({
                  smsEnabled: value,
                })
              }
            />

            <ChannelCard
              icon="🔔"
              title="Push"
              description="Push notifications for supported devices."
              enabled={
                settings.pushEnabled
              }
              onChange={(value) =>
                updateSettings({
                  pushEnabled: value,
                })
              }
            />

            <ChannelCard
              icon="💬"
              title="In-App"
              description="Notifications displayed inside the application."
              enabled={
                settings.inAppEnabled
              }
              onChange={(value) =>
                updateSettings({
                  inAppEnabled: value,
                })
              }
            />

          </div>

        </section>

      </div>
    </main>
  );
}

function ChannelCard({
  icon,
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="notification-channel-card">

      <div className="notification-channel-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{description}</p>

      <div className="notification-channel-footer">

        <span
          className={`notification-status ${
            enabled
              ? "enabled"
              : "disabled"
          }`}
        >
          {enabled
            ? "Enabled"
            : "Disabled"}
        </span>

        <button
          className={`notification-toggle ${
            enabled ? "active" : ""
          }`}
          onClick={() =>
            onChange(!enabled)
          }
        >
          <span />
        </button>

      </div>

    </div>
  );
}

export default NotificationChannels;