import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCommunication } from "./CommunicationContext";

function Conversations() {
  const {
    conversations,
    unreadCount,
  } = useCommunication();

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [status, setStatus] = useState("All");

  const filtered = useMemo(() => {
    return conversations.filter((conversation) => {
      const matchesSearch =
        `${conversation.customer} ${conversation.subject} ${conversation.lastMessage}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesType =
        type === "All" ||
        conversation.type === type;

      const matchesStatus =
        status === "All" ||
        conversation.status === status;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus
      );
    });
  }, [
    conversations,
    search,
    type,
    status,
  ]);

  return (
    <main className="communication-page">
      <div className="communication-container">

        <div className="communication-header">

          <div>
            <span className="communication-badge">
              COM-01 / COM-02
            </span>

            <h1>Messages</h1>

            <p>
              Customer and internal communication
              conversations.
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

          <div className="communication-toolbar">

            <div className="communication-search">
              🔎

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search conversations..."
              />
            </div>

            <select
              value={type}
              onChange={(e) =>
                setType(e.target.value)
              }
            >
              <option value="All">
                All Types
              </option>

              <option value="Customer">
                Customer
              </option>

              <option value="Internal">
                Internal
              </option>
            </select>

            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value)
              }
            >
              <option value="All">
                All Status
              </option>

              <option value="Open">
                Open
              </option>

              <option value="Closed">
                Closed
              </option>
            </select>

          </div>


          <div className="communication-message-list">

            {filtered.map((conversation) => (

              <Link
                key={conversation.id}
                to={`/communication/conversations/${conversation.id}`}
                className="communication-conversation"
              >

                <div className="communication-avatar">
                  {conversation.customer
                    .charAt(0)
                    .toUpperCase()}
                </div>

                <div className="communication-conversation-content">

                  <div className="communication-conversation-top">

                    <strong>
                      {conversation.customer}
                    </strong>

                    <small>
                      {new Date(
                        conversation.updatedAt
                      ).toLocaleString()}
                    </small>

                  </div>

                  <h3>
                    {conversation.subject}
                  </h3>

                  <p>
                    {conversation.lastMessage}
                  </p>

                  <div className="communication-conversation-meta">

                    <span>
                      {conversation.type}
                    </span>

                    <span
                      className={`communication-status ${
                        conversation.status ===
                        "Open"
                          ? "open"
                          : "closed"
                      }`}
                    >
                      {conversation.status}
                    </span>

                    {conversation.unread >
                      0 && (
                      <span className="communication-unread">
                        {conversation.unread} unread
                      </span>
                    )}

                  </div>

                </div>

                <strong className="communication-arrow">
                  →
                </strong>

              </Link>
            ))}


            {filtered.length === 0 && (
              <div className="communication-empty">
                <strong>
                  No conversations found
                </strong>

                <p>
                  Try changing your search or
                  filters.
                </p>
              </div>
            )}

          </div>

          <div className="communication-footer-count">
            Showing {filtered.length} of{" "}
            {conversations.length} conversations
            · {unreadCount} unread
          </div>

        </section>

      </div>
    </main>
  );
}

export default Conversations;