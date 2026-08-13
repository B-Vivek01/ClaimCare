import {
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const initialMessages = [
  {
    id: "CONV-1001",
    customer: "Rahul Kumar",
    claim: "CLM-1001",
    channel: "Email",
    subject: "Claim Status Update",
    lastMessage:
      "I would like to know the current status of my claim.",
    time: "09:15",
    unread: true,
  },
  {
    id: "CONV-1002",
    customer: "Priya Sharma",
    claim: "CLM-1002",
    channel: "SMS",
    subject: "Policy Renewal",
    lastMessage:
      "Your policy renewal is due soon.",
    time: "08:40",
    unread: false,
  },
  {
    id: "CONV-1003",
    customer: "Anil Kumar",
    claim: "CLM-1003",
    channel: "WhatsApp",
    subject: "Document Request",
    lastMessage:
      "I have uploaded the requested document.",
    time: "Yesterday",
    unread: true,
  },
];

function OperationsCommunications() {
  const navigate =
    useNavigate();

  const [messages] =
    useState(
      initialMessages
    );

  const [search, setSearch] =
    useState("");

  const [channel, setChannel] =
    useState("All");

  const filteredMessages =
    useMemo(() => {
      return messages.filter(
        (message) => {
          const text =
            `${message.customer}
            ${message.claim}
            ${message.subject}
            ${message.lastMessage}`
              .toLowerCase();

          return (
            text.includes(
              search.toLowerCase()
            ) &&
            (
              channel === "All" ||
              message.channel ===
                channel
            )
          );
        }
      );
    }, [
      messages,
      search,
      channel,
    ]);

  const unread =
    messages.filter(
      (message) =>
        message.unread
    ).length;

  return (
    <>
      <Navbar />

      <main className="operations-page">
        <div className="operations-container">

          <div className="operations-header">

            <div>
              <span className="operations-badge">
                OPS-08 · COMMUNICATIONS
              </span>

              <h1>
                Operations Communications
              </h1>

              <p>
                Manage customer and internal
                communication from the operations workspace.
              </p>
            </div>

            <Link
              to="/ops"
              className="operations-secondary-button"
            >
              ← Operations Portal
            </Link>

          </div>


          <div className="workqueue-summary">

            <Stat
              label="Conversations"
              value={
                messages.length
              }
            />

            <Stat
              label="Unread"
              value={unread}
            />

            <Stat
              label="Email"
              value={
                messages.filter(
                  (item) =>
                    item.channel ===
                    "Email"
                ).length
              }
            />

            <Stat
              label="SMS"
              value={
                messages.filter(
                  (item) =>
                    item.channel ===
                    "SMS"
                ).length
              }
            />

            <Stat
              label="WhatsApp"
              value={
                messages.filter(
                  (item) =>
                    item.channel ===
                    "WhatsApp"
                ).length
              }
            />

          </div>


          <section className="operations-action-grid">

            <Link
              to="/communication/templates"
              className="operations-action-card"
            >

              <span>
                📝
              </span>

              <div>
                <strong>
                  Templates
                </strong>

                <small>
                  Email, SMS and WhatsApp templates
                </small>
              </div>

            </Link>


            <Link
              to="/communication/broadcast"
              className="operations-action-card"
            >

              <span>
                📢
              </span>

              <div>
                <strong>
                  Broadcast
                </strong>

                <small>
                  Schedule customer broadcasts
                </small>
              </div>

            </Link>


            <Link
              to="/communication/campaigns"
              className="operations-action-card"
            >

              <span>
                📊
              </span>

              <div>
                <strong>
                  Campaign History
                </strong>

                <small>
                  Review delivery reports
                </small>
              </div>

            </Link>


            <Link
              to="/communication"
              className="operations-action-card"
            >

              <span>
                💬
              </span>

              <div>
                <strong>
                  Communication Center
                </strong>

                <small>
                  Open full communication workspace
                </small>
              </div>

            </Link>

          </section>


          <section className="workqueue-card">

            <div className="workqueue-card-header">

              <div>
                <span>
                  COM-01 / COM-02 / COM-04
                </span>

                <h2>
                  Customer Conversations
                </h2>
              </div>

              <strong>
                {filteredMessages.length} conversations
              </strong>

            </div>


            <div className="workqueue-toolbar">

              <div className="workqueue-search">

                <span>
                  🔍
                </span>

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search conversations..."
                />

              </div>


              <select
                value={channel}
                onChange={(event) =>
                  setChannel(
                    event.target.value
                  )
                }
              >

                <option value="All">
                  All Channels
                </option>

                <option value="Email">
                  Email
                </option>

                <option value="SMS">
                  SMS
                </option>

                <option value="WhatsApp">
                  WhatsApp
                </option>

              </select>

            </div>


            <div className="communication-conversation-list">

              {filteredMessages.map(
                (message) => (

                  <button
                    key={
                      message.id
                    }
                    className={
                      message.unread
                        ? "communication-conversation unread"
                        : "communication-conversation"
                    }
                    onClick={() =>
                      navigate(
                        `/communication/${message.id}`
                      )
                    }
                  >

                    <div className="communication-avatar">
                      {
                        message.customer.charAt(
                          0
                        )
                      }
                    </div>


                    <div className="communication-conversation-main">

                      <div className="communication-conversation-top">

                        <strong>
                          {
                            message.customer
                          }
                        </strong>

                        <span>
                          {
                            message.time
                          }
                        </span>

                      </div>


                      <div className="communication-conversation-subject">
                        {
                          message.subject
                        }
                      </div>


                      <p>
                        {
                          message.lastMessage
                        }
                      </p>

                    </div>


                    <div className="communication-conversation-meta">

                      <span className="communication-channel">
                        {
                          message.channel
                        }
                      </span>

                      {message.unread && (
                        <span className="communication-unread">
                          Unread
                        </span>
                      )}

                    </div>

                  </button>

                )
              )}

            </div>

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

function Stat({
  label,
  value,
}) {
  return (
    <div className="workqueue-stat">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

export default OperationsCommunications;