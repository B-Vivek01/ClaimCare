import { Link } from "react-router-dom";
import { useCommunication } from "./CommunicationContext";

function CommunicationDashboard() {
  const {
    conversations,
    templates,
    broadcasts,
    unreadCount,
  } = useCommunication();

  const customerConversations =
    conversations.filter(
      (item) => item.type === "Customer"
    ).length;

  const internalConversations =
    conversations.filter(
      (item) => item.type === "Internal"
    ).length;

  return (
    <main className="communication-page">
      <div className="communication-container">

        <div className="communication-header">
          <div>
            <span className="communication-badge">
              COMMUNICATION CENTER
            </span>

            <h1>Communication Center</h1>

            <p>
              Manage customer and internal
              communications, templates and
              broadcasts.
            </p>
          </div>
        </div>

        <div className="communication-summary">

          <div className="communication-summary-card">
            <span>UNREAD</span>
            <strong>{unreadCount}</strong>
            <small>Unread messages</small>
          </div>

          <div className="communication-summary-card">
            <span>CUSTOMER</span>
            <strong>{customerConversations}</strong>
            <small>Customer conversations</small>
          </div>

          <div className="communication-summary-card">
            <span>INTERNAL</span>
            <strong>{internalConversations}</strong>
            <small>Internal conversations</small>
          </div>

          <div className="communication-summary-card">
            <span>TEMPLATES</span>
            <strong>{templates.length}</strong>
            <small>Available templates</small>
          </div>

        </div>

        <section className="communication-section">

          <div className="communication-section-title">
            <span>COMMUNICATION MODULES</span>
            <h2>Manage Communications</h2>
          </div>

          <div className="communication-module-grid">

            <Link
              to="/communication/conversations"
              className="communication-module-card"
            >
              <div className="communication-module-icon">
                💬
              </div>

              <span>COM-01 / COM-02</span>

              <h3>Messages</h3>

              <p>
                Manage customer and internal
                conversations.
              </p>

              <strong>→</strong>
            </Link>

            <Link
              to="/communication/templates"
              className="communication-module-card"
            >
              <div className="communication-module-icon">
                📝
              </div>

              <span>COM-06 → COM-10</span>

              <h3>Templates</h3>

              <p>
                Create and manage Email, SMS
                and WhatsApp templates.
              </p>

              <strong>→</strong>
            </Link>

            <Link
              to="/communication/broadcasts"
              className="communication-module-card"
            >
              <div className="communication-module-icon">
                📢
              </div>

              <span>COM-11 → COM-13</span>

              <h3>Broadcasts</h3>

              <p>
                Create customer campaigns and
                schedule broadcasts.
              </p>

              <strong>→</strong>
            </Link>

            <Link
              to="/communication/reports"
              className="communication-module-card"
            >
              <div className="communication-module-icon">
                📊
              </div>

              <span>COM-14</span>

              <h3>Delivery Reports</h3>

              <p>
                View communication delivery
                outcomes.
              </p>

              <strong>→</strong>
            </Link>

            <Link
              to="/communication/settings"
              className="communication-module-card"
            >
              <div className="communication-module-icon">
                ⚙️
              </div>

              <span>SETTINGS</span>

              <h3>Communication Settings</h3>

              <p>
                Configure supported communication
                channels.
              </p>

              <strong>→</strong>
            </Link>

          </div>

        </section>

        <section className="communication-card">

          <div className="communication-card-header">
            <div>
              <span>RECENT CAMPAIGNS</span>
              <h2>Broadcast Activity</h2>
            </div>

            <Link
              to="/communication/broadcasts"
              className="communication-link-button"
            >
              View All
            </Link>
          </div>

          <div className="communication-mini-list">

            {broadcasts.slice(0, 4).map(
              (broadcast) => (
                <div
                  key={broadcast.id}
                  className="communication-mini-item"
                >
                  <div>
                    <strong>
                      {broadcast.name}
                    </strong>

                    <small>
                      {broadcast.channel} ·{" "}
                      {broadcast.group}
                    </small>
                  </div>

                  <span
                    className={`communication-status ${broadcast.status.toLowerCase()}`}
                  >
                    {broadcast.status}
                  </span>
                </div>
              )
            )}

          </div>

        </section>

      </div>
    </main>
  );
}

export default CommunicationDashboard;