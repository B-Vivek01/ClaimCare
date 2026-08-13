import { Link } from "react-router-dom";
import { useNotification } from "./NotificationContext";

function NotificationPreferences() {
  const {
    preferences,
    updatePreference,
  } = useNotification();

  return (
    <main className="notification-page">
      <div className="notification-container">

        <div className="notification-header">

          <div>
            <span className="notification-badge">
              NOT-06
            </span>

            <h1>
              Channel Preferences
            </h1>

            <p>
              Choose which notification channels
              you want to use.
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
                USER PREFERENCES
              </span>

              <h2>
                Notification Channels
              </h2>
            </div>
          </div>

          <div className="notification-settings-list">

            <PreferenceRow
              title="Email Notifications"
              description="Receive supported notifications through email."
              enabled={preferences.email}
              onChange={(value) =>
                updatePreference(
                  "email",
                  value
                )
              }
            />

            <PreferenceRow
              title="SMS Notifications"
              description="Receive supported notifications through SMS."
              enabled={preferences.sms}
              onChange={(value) =>
                updatePreference(
                  "sms",
                  value
                )
              }
            />

            <PreferenceRow
              title="Push Notifications"
              description="Receive push notifications on supported devices."
              enabled={preferences.push}
              onChange={(value) =>
                updatePreference(
                  "push",
                  value
                )
              }
            />

            <PreferenceRow
              title="In-App Notifications"
              description="Show notifications inside the ClaimCare application."
              enabled={preferences.inApp}
              onChange={(value) =>
                updatePreference(
                  "inApp",
                  value
                )
              }
            />

          </div>

        </section>

      </div>
    </main>
  );
}

function PreferenceRow({
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="notification-setting-row">

      <div>
        <strong>{title}</strong>
        <p>{description}</p>
      </div>

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
  );
}

export default NotificationPreferences;