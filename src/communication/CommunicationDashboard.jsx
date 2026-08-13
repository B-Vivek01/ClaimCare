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

import {
  useCommunication,
} from "./CommunicationContext";

function CommunicationDashboard() {
  const navigate =
    useNavigate();

  const {
    conversations,
  } = useCommunication();

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    channel,
    setChannel,
  ] = useState("All");

  const [
    unreadOnly,
    setUnreadOnly,
  ] = useState(false);

  const filteredConversations =
    useMemo(() => {
      return conversations.filter(
        (conversation) => {
          const text =
            `${conversation.customer}
            ${conversation.subject}
            ${conversation.channel}`
              .toLowerCase();

          const matchesSearch =
            text.includes(
              search.toLowerCase()
            );

          const matchesChannel =
            channel === "All" ||
            conversation.channel ===
              channel;

          const matchesUnread =
            !unreadOnly ||
            conversation.unread;

          return (
            matchesSearch &&
            matchesChannel &&
            matchesUnread
          );
        }
      );
    }, [
      conversations,
      search,
      channel,
      unreadOnly,
    ]);

  const unreadCount =
    conversations.filter(
      (item) =>
        item.unread
    ).length;

  const emailCount =
    conversations.filter(
      (item) =>
        item.channel ===
        "Email"
    ).length;

  const smsCount =
    conversations.filter(
      (item) =>
        item.channel ===
        "SMS"
    ).length;

  const whatsappCount =
    conversations.filter(
      (item) =>
        item.channel ===
        "WhatsApp"
    ).length;

  return (
    <>
      <Navbar />

      <main className="communication-page">

        <div className="communication-container">

          <div className="communication-header">

            <div>
              <span className="communication-badge">
                COMMUNICATION CENTER
              </span>

              <h1>
                Communication Center
              </h1>

              <p>
                Manage customer conversations,
                templates and broadcasts.
              </p>
            </div>

            <div className="communication-header-actions">

              <button
                className="communication-secondary-button"
                onClick={() =>
                  navigate(
                    "/communication/templates"
                  )
                }
              >
                Templates
              </button>

              <button
                className="communication-primary-button"
                onClick={() =>
                  navigate(
                    "/communication/broadcast"
                  )
                }
              >
                New Broadcast
              </button>

            </div>

          </div>


          <div className="communication-stat-grid">

            <Stat
              label="Conversations"
              value={
                conversations.length
              }
            />

            <Stat
              label="Unread"
              value={
                unreadCount
              }
            />

            <Stat
              label="Email"
              value={
                emailCount
              }
            />

            <Stat
              label="SMS / WhatsApp"
              value={
                smsCount +
                whatsappCount
              }
            />

          </div>


          <section className="communication-channel-grid">

            <Link
              to="/communication"
              className="communication-channel-card"
            >
              <span>
                ✉️
              </span>

              <div>
                <strong>
                  Customer Messages
                </strong>

                <small>
                  COM-01
                </small>
              </div>
            </Link>


            <Link
              to="/communication/internal"
              className="communication-channel-card"
            >
              <span>
                💬
              </span>

              <div>
                <strong>
                  Internal Messages
                </strong>

                <small>
                  COM-02
                </small>
              </div>
            </Link>


            <Link
              to="/communication/templates"
              className="communication-channel-card"
            >
              <span>
                📝
              </span>

              <div>
                <strong>
                  Message Templates
                </strong>

                <small>
                  COM-06 → COM-10
                </small>
              </div>
            </Link>


            <Link
              to="/communication/broadcast"
              className="communication-channel-card"
            >
              <span>
                📢
              </span>

              <div>
                <strong>
                  Broadcast
                </strong>

                <small>
                  COM-11 → COM-12
                </small>
              </div>
            </Link>

          </section>


          <section className="communication-list-card">

            <div className="communication-card-header">

              <div>

                <span>
                  COM-01 / COM-04 / COM-05
                </span>

                <h2>
                  Customer Conversations
                </h2>

              </div>

              <strong>
                {filteredConversations.length}
              </strong>

            </div>


            <div className="communication-toolbar">

              <div className="communication-search">

                🔍

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


              <button
                className={
                  unreadOnly
                    ? "communication-filter active"
                    : "communication-filter"
                }
                onClick={() =>
                  setUnreadOnly(
                    (value) =>
                      !value
                  )
                }
              >
                Unread Only
              </button>

            </div>


            <div className="communication-conversation-list">

              {filteredConversations.length ===
              0 ? (

                <div className="communication-empty">

                  <h3>
                    No conversations found
                  </h3>

                  <p>
                    Change the search or
                    communication filters.
                  </p>

                </div>

              ) : (

                filteredConversations.map(
                  (conversation) => (

                    <Link
                      key={
                        conversation.id
                      }
                      to={`/communication/${conversation.id}`}
                      className={
                        conversation.unread
                          ? "communication-conversation unread"
                          : "communication-conversation"
                      }
                    >

                      <div className="communication-avatar">
                        {
                          conversation.customer
                            .charAt(0)
                            .toUpperCase()
                        }
                      </div>


                      <div className="communication-conversation-main">

                        <div className="communication-conversation-top">

                          <strong>
                            {
                              conversation.customer
                            }
                          </strong>

                          <span>
                            {
                              conversation.updatedAt
                            }
                          </span>

                        </div>


                        <div className="communication-conversation-subject">
                          {
                            conversation.subject
                          }
                        </div>


                        <p>

                          {
                            conversation.messages[
                              conversation
                                .messages
                                .length - 1
                            ]?.text
                          }

                        </p>

                      </div>


                      <div className="communication-conversation-meta">

                        <span className="communication-channel">
                          {
                            conversation.channel
                          }
                        </span>

                        {conversation.unread && (
                          <span className="communication-unread">
                            Unread
                          </span>
                        )}

                      </div>

                    </Link>

                  )
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
    <div className="communication-stat-card">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}

export default CommunicationDashboard;