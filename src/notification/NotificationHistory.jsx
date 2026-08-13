import { Link } from "react-router-dom";
import { useNotification } from "./NotificationContext";

function NotificationHistory() {
  const { notifications } =
    useNotification();

  return (
    <main className="notification-page">
      <div className="notification-container">

        <div className="notification-header">

          <div>
            <span className="notification-badge">
              NOTIFICATION HISTORY
            </span>

            <h1>
              Notification History
            </h1>

            <p>
              Review previous notification
              activity.
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

          <div className="notification-table-wrapper">

            <table className="notification-table">

              <thead>
                <tr>
                  <th>Notification</th>
                  <th>Type</th>
                  <th>Channel</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>

                {notifications.map(
                  (item) => (
                    <tr key={item.id}>

                      <td>
                        <strong>
                          {item.title}
                        </strong>

                        <small>
                          {item.id}
                        </small>
                      </td>

                      <td>
                        {item.type}
                      </td>

                      <td>
                        {item.channel}
                      </td>

                      <td>
                        <span
                          className={`notification-status ${
                            item.status ===
                            "Unread"
                              ? "unread"
                              : "read"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td>
                        {new Date(
                          item.createdAt
                        ).toLocaleString()}
                      </td>

                    </tr>
                  )
                )}

              </tbody>

            </table>

          </div>

        </section>

      </div>
    </main>
  );
}

export default NotificationHistory;