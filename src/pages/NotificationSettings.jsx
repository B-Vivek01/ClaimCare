import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function NotificationSettings() {
  const navigate = useNavigate();

  const defaultSettings = {
    email: true,
    sms: true,
    push: true,

    claimUpdates: true,
    paymentUpdates: true,
    documentReminders: true,
    securityAlerts: true,

    frequency: "Immediately",
  };

  const [settings, setSettings] =
    useState(defaultSettings);

  const [savedSettings, setSavedSettings] =
    useState(defaultSettings);

  const [status, setStatus] = useState("idle");

  const handleToggle = (name) => {
    setSettings((previous) => ({
      ...previous,
      [name]: !previous[name],
    }));

    setStatus("idle");
  };

  const handleFrequencyChange = (event) => {
    setSettings((previous) => ({
      ...previous,
      frequency: event.target.value,
    }));

    setStatus("idle");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    setStatus("saving");

    try {
      /*
       * BACKEND INTEGRATION POINT
       *
       * Send the notification settings to the
       * authenticated customer preferences API.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 900)
      );

      setSavedSettings(settings);

      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  };

  const handleReset = () => {
    setSettings(savedSettings);
    setStatus("idle");
  };

  const enabledChannels = [
    settings.email,
    settings.sms,
    settings.push,
  ].filter(Boolean).length;

  const enabledNotifications = [
    settings.claimUpdates,
    settings.paymentUpdates,
    settings.documentReminders,
    settings.securityAlerts,
  ].filter(Boolean).length;

  return (
    <>

      <main className="notification-settings-page">

        <div className="notification-settings-container">

          {/* HEADER */}

          <div className="notification-settings-header">

            <div>

              <span className="notification-settings-badge">
                PROFILE
              </span>

              <h1>
                Notification Settings
              </h1>

              <p>
                Choose which notifications you want to
                receive and how they should be delivered.
              </p>

            </div>

            <button
              type="button"
              className="notification-back-button"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              ← Dashboard
            </button>

          </div>


          <form onSubmit={handleSave}>


            {/* CHANNELS */}

            <section className="notification-card">

              <div className="notification-card-header">

                <div className="notification-card-icon">
                  🔔
                </div>

                <div>

                  <h2>
                    Notification Channels
                  </h2>

                  <p>
                    Choose where you want to receive
                    notifications.
                  </p>

                </div>

              </div>


              <div className="notification-options">


                {/* EMAIL */}

                <label className="notification-option">

                  <div className="notification-option-content">

                    <div className="notification-option-icon">
                      @
                    </div>

                    <div>

                      <strong>
                        Email Notifications
                      </strong>

                      <span>
                        Receive notifications through
                        your registered email address.
                      </span>

                    </div>

                  </div>

                  <input
                    type="checkbox"
                    checked={settings.email}
                    onChange={() =>
                      handleToggle("email")
                    }
                  />

                </label>


                {/* SMS */}

                <label className="notification-option">

                  <div className="notification-option-content">

                    <div className="notification-option-icon">
                      SMS
                    </div>

                    <div>

                      <strong>
                        SMS Notifications
                      </strong>

                      <span>
                        Receive important notifications
                        through SMS.
                      </span>

                    </div>

                  </div>

                  <input
                    type="checkbox"
                    checked={settings.sms}
                    onChange={() =>
                      handleToggle("sms")
                    }
                  />

                </label>


                {/* PUSH */}

                <label className="notification-option">

                  <div className="notification-option-content">

                    <div className="notification-option-icon">
                      P
                    </div>

                    <div>

                      <strong>
                        Push Notifications
                      </strong>

                      <span>
                        Receive notifications directly
                        on supported devices.
                      </span>

                    </div>

                  </div>

                  <input
                    type="checkbox"
                    checked={settings.push}
                    onChange={() =>
                      handleToggle("push")
                    }
                  />

                </label>

              </div>

            </section>


            {/* EVENTS */}

            <section className="notification-card">

              <div className="notification-card-header">

                <div className="notification-card-icon">
                  ✓
                </div>

                <div>

                  <h2>
                    Notification Types
                  </h2>

                  <p>
                    Select the types of updates you want
                    to receive.
                  </p>

                </div>

              </div>


              <div className="notification-options">


                {/* CLAIM */}

                <label className="notification-option">

                  <div className="notification-option-content">

                    <div className="notification-option-icon">
                      C
                    </div>

                    <div>

                      <strong>
                        Claim Updates
                      </strong>

                      <span>
                        Updates about your claims,
                        statuses and activities.
                      </span>

                    </div>

                  </div>

                  <input
                    type="checkbox"
                    checked={settings.claimUpdates}
                    onChange={() =>
                      handleToggle(
                        "claimUpdates"
                      )
                    }
                  />

                </label>


                {/* PAYMENT */}

                <label className="notification-option">

                  <div className="notification-option-content">

                    <div className="notification-option-icon">
                      ₹
                    </div>

                    <div>

                      <strong>
                        Payment Updates
                      </strong>

                      <span>
                        Updates related to payments and
                        payment status.
                      </span>

                    </div>

                  </div>

                  <input
                    type="checkbox"
                    checked={settings.paymentUpdates}
                    onChange={() =>
                      handleToggle(
                        "paymentUpdates"
                      )
                    }
                  />

                </label>


                {/* DOCUMENT */}

                <label className="notification-option">

                  <div className="notification-option-content">

                    <div className="notification-option-icon">
                      D
                    </div>

                    <div>

                      <strong>
                        Document Reminders
                      </strong>

                      <span>
                        Reminders related to required
                        documents or actions.
                      </span>

                    </div>

                  </div>

                  <input
                    type="checkbox"
                    checked={
                      settings.documentReminders
                    }
                    onChange={() =>
                      handleToggle(
                        "documentReminders"
                      )
                    }
                  />

                </label>


                {/* SECURITY */}

                <label className="notification-option">

                  <div className="notification-option-content">

                    <div className="notification-option-icon">
                      S
                    </div>

                    <div>

                      <strong>
                        Security Alerts
                      </strong>

                      <span>
                        Important account and security
                        notifications.
                      </span>

                    </div>

                  </div>

                  <input
                    type="checkbox"
                    checked={
                      settings.securityAlerts
                    }
                    onChange={() =>
                      handleToggle(
                        "securityAlerts"
                      )
                    }
                  />

                </label>

              </div>

            </section>


            {/* FREQUENCY */}

            <section className="notification-card">

              <div className="notification-card-header">

                <div className="notification-card-icon">
                  ⏱
                </div>

                <div>

                  <h2>
                    Notification Frequency
                  </h2>

                  <p>
                    Choose how frequently supported
                    notifications should be delivered.
                  </p>

                </div>

              </div>


              <div className="notification-frequency">

                <label htmlFor="notificationFrequency">
                  Frequency
                </label>

                <select
                  id="notificationFrequency"
                  value={settings.frequency}
                  onChange={handleFrequencyChange}
                >

                  <option value="Immediately">
                    Immediately
                  </option>

                  <option value="Daily">
                    Daily Summary
                  </option>

                  <option value="Weekly">
                    Weekly Summary
                  </option>

                </select>

                <small>
                  Frequency options apply only to
                  notifications that support batching.
                </small>

              </div>

            </section>


            {/* SUMMARY */}

            <section className="notification-summary">

              <div>

                <span>
                  Enabled channels
                </span>

                <strong>
                  {enabledChannels}
                </strong>

              </div>

              <div>

                <span>
                  Enabled notification types
                </span>

                <strong>
                  {enabledNotifications}
                </strong>

              </div>

              <div>

                <span>
                  Frequency
                </span>

                <strong>
                  {settings.frequency}
                </strong>

              </div>

            </section>


            {/* SUCCESS */}

            {status === "success" && (

              <div className="notification-success">

                <span>✓</span>

                <div>

                  <strong>
                    Notification settings saved
                  </strong>

                  <p>
                    Your notification preferences have
                    been updated successfully.
                  </p>

                </div>

              </div>

            )}


            {/* ERROR */}

            {status === "error" && (

              <div className="notification-error">

                Unable to save your notification
                settings. Please try again.

              </div>

            )}


            {/* ACTIONS */}

            <div className="notification-actions">

              <button
                type="button"
                className="notification-reset-button"
                onClick={handleReset}
              >
                Reset Changes
              </button>

              <button
                type="submit"
                className="notification-save-button"
                disabled={status === "saving"}
              >
                {status === "saving"
                  ? "Saving..."
                  : "Save Settings"}
              </button>

            </div>

          </form>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default NotificationSettings;