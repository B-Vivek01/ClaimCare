import { useState } from "react";
import { Link } from "react-router-dom";

import {
  useNotification,
} from "./NotificationContext";

function ReminderSettings() {
  const {
    reminders,
    updateReminder,
    addReminder,
    deleteReminder,
  } = useNotification();

  const [showForm, setShowForm] =
    useState(false);

  const [name, setName] =
    useState("");

  const [event, setEvent] =
    useState("Policy Expiry");

  const [channel, setChannel] =
    useState("Email");

  const [frequency, setFrequency] =
    useState("Immediately");

  const createReminder = () => {
    if (!name.trim()) {
      return;
    }

    addReminder({
      name,
      event,
      channel,
      frequency,
      enabled: true,
    });

    setName("");
    setShowForm(false);
  };

  return (
    <main className="notification-page">
      <div className="notification-container">

        <div className="notification-header">

          <div>
            <span className="notification-badge">
              NOT-05
            </span>

            <h1>
              Reminder Engine
            </h1>

            <p>
              Configure reminders for supported
              business events.
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
                REMINDER RULES
              </span>

              <h2>
                Configured Reminders
              </h2>
            </div>

            <button
              className="notification-primary-button"
              onClick={() =>
                setShowForm(!showForm)
              }
            >
              + Add Reminder
            </button>

          </div>

          {showForm && (
            <div className="notification-form">

              <label>
                Reminder Name

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter reminder name"
                />
              </label>

              <label>
                Event

                <select
                  value={event}
                  onChange={(e) =>
                    setEvent(e.target.value)
                  }
                >
                  <option>
                    Policy Expiry
                  </option>

                  <option>
                    Claim SLA Threshold
                  </option>

                  <option>
                    Missing Documents
                  </option>

                  <option>
                    Payment Due
                  </option>
                </select>
              </label>

              <label>
                Channel

                <select
                  value={channel}
                  onChange={(e) =>
                    setChannel(e.target.value)
                  }
                >
                  <option>Email</option>
                  <option>SMS</option>
                  <option>Push</option>
                  <option>In-App</option>
                </select>
              </label>

              <label>
                Frequency

                <select
                  value={frequency}
                  onChange={(e) =>
                    setFrequency(
                      e.target.value
                    )
                  }
                >
                  <option>
                    Immediately
                  </option>

                  <option>
                    1 day before
                  </option>

                  <option>
                    3 days before
                  </option>

                  <option>
                    7 days before
                  </option>

                  <option>
                    Every 3 days
                  </option>
                </select>
              </label>

              <button
                className="notification-primary-button"
                onClick={createReminder}
              >
                Create Reminder
              </button>

            </div>
          )}

          <div className="notification-reminder-list">

            {reminders.map((reminder) => (

              <div
                key={reminder.id}
                className="notification-reminder-item"
              >

                <div>
                  <strong>
                    {reminder.name}
                  </strong>

                  <p>
                    {reminder.event} ·{" "}
                    {reminder.channel} ·{" "}
                    {reminder.frequency}
                  </p>
                </div>

                <div className="notification-reminder-actions">

                  <button
                    className={`notification-status ${
                      reminder.enabled
                        ? "enabled"
                        : "disabled"
                    }`}
                    onClick={() =>
                      updateReminder(
                        reminder.id,
                        {
                          enabled:
                            !reminder.enabled,
                        }
                      )
                    }
                  >
                    {reminder.enabled
                      ? "Enabled"
                      : "Disabled"}
                  </button>

                  <button
                    className="notification-danger-button"
                    onClick={() =>
                      deleteReminder(
                        reminder.id
                      )
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>
            ))}

          </div>

        </section>

      </div>
    </main>
  );
}

export default ReminderSettings;