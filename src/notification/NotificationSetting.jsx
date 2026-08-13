import { Link } from "react-router-dom";
import { useNotification } from "./NotificationContext";

function NotificationSetting() {
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
              NOT-07
            </span>

            <h1>
              Notification Settings
            </h1>

            <p>
              Configure notification frequency
              and quiet hours.
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
                FREQUENCY
              </span>

              <h2>
                Default Notification Frequency
              </h2>
            </div>

          </div>

          <div className="notification-form">

            <label>
              Notification Frequency

              <select
                value={
                  settings.defaultFrequency
                }
                onChange={(e) =>
                  updateSettings({
                    defaultFrequency:
                      e.target.value,
                  })
                }
              >
                <option>
                  Immediately
                </option>

                <option>
                  Every 15 minutes
                </option>

                <option>
                  Hourly
                </option>

                <option>
                  Daily Digest
                </option>
              </select>
            </label>

          </div>

        </section>

        <section className="notification-card">

          <div className="notification-card-header">

            <div>
              <span>
                QUIET HOURS
              </span>

              <h2>
                Notification Quiet Hours
              </h2>
            </div>

          </div>

          <div className="notification-setting-row">

            <div>
              <strong>
                Enable Quiet Hours
              </strong>

              <p>
                Reduce notifications during the
                configured time period.
              </p>
            </div>

            <button
              className={`notification-toggle ${
                settings.quietHours
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                updateSettings({
                  quietHours:
                    !settings.quietHours,
                })
              }
            >
              <span />
            </button>

          </div>

          {settings.quietHours && (
            <div className="notification-time-grid">

              <label>
                Start Time

                <input
                  type="time"
                  value={
                    settings.quietStart
                  }
                  onChange={(e) =>
                    updateSettings({
                      quietStart:
                        e.target.value,
                    })
                  }
                />
              </label>

              <label>
                End Time

                <input
                  type="time"
                  value={
                    settings.quietEnd
                  }
                  onChange={(e) =>
                    updateSettings({
                      quietEnd:
                        e.target.value,
                    })
                  }
                />
              </label>

            </div>
          )}

        </section>

      </div>
    </main>
  );
}

export default NotificationSetting;