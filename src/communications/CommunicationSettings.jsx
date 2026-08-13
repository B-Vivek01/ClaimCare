import { Link } from "react-router-dom";

import {
  useCommunication,
} from "./CommunicationContext";

function CommunicationSettings() {
  const {
    settings,
    updateSettings,
  } = useCommunication();

  return (
    <main className="communication-page">
      <div className="communication-container">

        <div className="communication-header">

          <div>
            <span className="communication-badge">
              COMMUNICATION SETTINGS
            </span>

            <h1>
              Communication Settings
            </h1>

            <p>
              Configure supported communication
              channels and messaging behavior.
            </p>
          </div>

          <Link
            to="/communication"
            className="communication-secondary-button"
          >
            ← Communication Center
          </Link>

        </div>


        <section className="communication-card">

          <div className="communication-card-header">

            <div>
              <span>
                CHANNELS
              </span>

              <h2>
                Communication Channels
              </h2>
            </div>

          </div>


          <div className="communication-settings-list">

            <SettingRow
              title="Email"
              description="Allow email communication."
              enabled={
                settings.emailEnabled
              }
              onChange={(value) =>
                updateSettings({
                  emailEnabled: value,
                })
              }
            />

            <SettingRow
              title="SMS"
              description="Allow SMS communication."
              enabled={
                settings.smsEnabled
              }
              onChange={(value) =>
                updateSettings({
                  smsEnabled: value,
                })
              }
            />

            <SettingRow
              title="WhatsApp"
              description="Allow WhatsApp communication when enabled."
              enabled={
                settings.whatsappEnabled
              }
              onChange={(value) =>
                updateSettings({
                  whatsappEnabled: value,
                })
              }
            />

            <SettingRow
              title="Read Receipts"
              description="Display message read/unread state."
              enabled={
                settings.readReceipts
              }
              onChange={(value) =>
                updateSettings({
                  readReceipts: value,
                })
              }
            />

          </div>

        </section>


        <section className="communication-card">

          <div className="communication-card-header">

            <div>
              <span>
                ATTACHMENTS
              </span>

              <h2>
                Attachment Settings
              </h2>
            </div>

          </div>


          <div className="communication-form">

            <label>
              Maximum Attachment Size (MB)

              <input
                type="number"
                min="1"
                value={
                  settings.attachmentLimit
                }
                onChange={(e) =>
                  updateSettings({
                    attachmentLimit:
                      Number(
                        e.target.value
                      ),
                  })
                }
              />
            </label>

          </div>

        </section>

      </div>
    </main>
  );
}

function SettingRow({
  title,
  description,
  enabled,
  onChange,
}) {
  return (
    <div className="communication-setting-row">

      <div>
        <strong>
          {title}
        </strong>

        <p>
          {description}
        </p>
      </div>

      <button
        className={`communication-toggle ${
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

export default CommunicationSettings;