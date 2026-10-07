import {
  useMemo,
  useState,
} from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import {
  useNotification,
} from "./NotificationContext";

function Notifications() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotification();

  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const saveAction = async action => {
    if (busy) return false;
    setBusy(true); setError('');
    try {
      if (!await action()) throw new Error('Notification change could not be saved. Please retry.');
      return true;
    } catch (issue) { setError(issue.message); return false; }
    finally { setBusy(false); }
  };

  const [search, setSearch] =
    useState("");

  const [filter, setFilter] =
    useState("All");

  const filtered =
    useMemo(() => {
      return notifications.filter(
        (item) => {
          const matchesSearch =
            `${item.title} ${item.message} ${item.type}`
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesFilter =
            filter === "All" ||
            item.status === filter;

          return (
            matchesSearch &&
            matchesFilter
          );
        }
      );
    }, [
      notifications,
      search,
      filter,
    ]);

  const openNotification = async (
    notification
  ) => {
    if (!await saveAction(() => markAsRead(notification.id))) return;

    if (notification.target) {
      navigate(notification.target);
    }
  };

  return (
    <main className="notification-page">
      {error && <p role="alert">{error}</p>}
      <div className="notification-container">

        <div className="notification-header">

          <div>
            <span className="notification-badge">
              NOT-04
            </span>

            <h1>Notifications</h1>

            <p>
              View and manage your notification
              center.
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

          <div className="notification-toolbar">

            <div className="notification-search">
              🔎

              <input
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search notifications..."
              />
            </div>

            <select
              value={filter}
              onChange={(e) =>
                setFilter(
                  e.target.value
                )
              }
            >
              <option value="All">
                All
              </option>

              <option value="Unread">
                Unread
              </option>

              <option value="Read">
                Read
              </option>
            </select>

            {unreadCount > 0 && (
              <button
                className="notification-primary-button"
                disabled={busy}
                onClick={() => saveAction(markAllAsRead)}
              >
                Mark All Read
              </button>
            )}

          </div>

          <div className="notification-list">

            {filtered.map(
              (notification) => (

                <div
                  key={notification.id}
                  className={`notification-item ${
                    notification.status ===
                    "Unread"
                      ? "notification-item-unread"
                      : ""
                  }`}
                >

                  <button
                    className="notification-item-main"
                    onClick={() =>
                      openNotification(
                        notification
                      )
                    }
                  >

                    <div className="notification-item-icon">
                      {notification.type ===
                      "Claim"
                        ? "📋"
                        : notification.type ===
                          "Policy"
                        ? "📄"
                        : "🔔"}
                    </div>

                    <div className="notification-item-content">

                      <div className="notification-item-top">

                        <strong>
                          {notification.title}
                        </strong>

                        <small>
                          {new Date(
                            notification.createdAt
                          ).toLocaleString()}
                        </small>

                      </div>

                      <p>
                        {notification.message}
                      </p>

                      <div className="notification-item-meta">

                        <span>
                          {notification.channel}
                        </span>

                        <span>
                          {notification.type}
                        </span>

                        <span
                          className={`notification-status ${
                            notification.status ===
                            "Unread"
                              ? "unread"
                              : "read"
                          }`}
                        >
                          {notification.status}
                        </span>

                      </div>

                    </div>

                  </button>

                  <button
                    className="notification-delete-button"
                    disabled={busy}
                    aria-label={`Delete notification: ${notification.title}`}
                    onClick={() =>
                      saveAction(() => deleteNotification(
                        notification.id
                      ))
                    }
                  >
                    ×
                  </button>

                </div>
              )
            )}

            {filtered.length === 0 && (
              <div className="notification-empty">
                <strong>
                  No notifications found
                </strong>

                <p>
                  Try changing your search
                  or filter.
                </p>
              </div>
            )}

          </div>

        </section>

      </div>
    </main>
  );
}

export default Notifications;
