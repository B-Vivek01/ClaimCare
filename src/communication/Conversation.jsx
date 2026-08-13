import {
  useRef,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  useCommunication,
} from "./CommunicationContext";

function Conversation() {
  const {
    id,
  } = useParams();

  const {
    conversations,
    sendMessage,
    markConversationRead,
  } = useCommunication();

  const conversation =
    conversations.find(
      (item) =>
        item.id === id
    );

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    attachment,
    setAttachment,
  ] = useState(null);

  const [
    internal,
    setInternal,
  ] = useState(false);

  const fileInputRef =
    useRef(null);

  if (!conversation) {
    return (
      <div className="communication-empty-page">

        <h1>
          Conversation Not Found
        </h1>

        <Link
          to="/communication"
          className="communication-primary-button"
        >
          Back to Communication Center
        </Link>

      </div>
    );
  }

  const submitMessage =
    () => {
      if (
        !message.trim() &&
        !attachment
      ) {
        return;
      }

      const prefix =
        internal
          ? "[Internal] "
          : "";

      sendMessage(
        conversation.id,
        `${prefix}${message}`,
        attachment
          ? attachment.name
          : null
      );

      setMessage("");
      setAttachment(null);

      if (fileInputRef.current) {
        fileInputRef.current.value =
          "";
      }
    };

  const handleAttachment =
    (event) => {
      const file =
        event.target.files?.[0];

      if (!file) {
        return;
      }

      setAttachment(file);
    };

  return (
    <>
      <Navbar />

      <main className="communication-page">

        <div className="communication-container">

          <div className="communication-header">

            <div>

              <span className="communication-badge">
                CONVERSATION
              </span>

              <h1>
                {
                  conversation.subject
                }
              </h1>

              <p>
                {
                  conversation.customer
                }
                {" · "}
                {
                  conversation.channel
                }
              </p>

            </div>

            <Link
              to="/communication"
              className="communication-secondary-button"
            >
              ← Conversations
            </Link>

          </div>


          <div className="conversation-layout">

            <section className="conversation-main">

              <div className="conversation-header-bar">

                <div>

                  <strong>
                    {
                      conversation.customer
                    }
                  </strong>

                  <span>
                    {
                      conversation.customerId
                    }
                  </span>

                </div>

                <span className="communication-channel">
                  {
                    conversation.channel
                  }
                </span>

              </div>


              <div className="conversation-messages">

                {conversation.messages.map(
                  (item) => (

                    <div
                      key={
                        item.id
                      }
                      className={
                        item.sender ===
                        "agent"
                          ? "message-row agent"
                          : "message-row customer"
                      }
                    >

                      <div className="message-bubble">

                        <div className="message-author">

                          {
                            item.senderName
                          }

                          <span>
                            {
                              item.time
                            }
                          </span>

                        </div>


                        <p>
                          {
                            item.text
                          }
                        </p>


                        {item.attachment && (

                          <div className="message-attachment">
                            📎{" "}
                            {
                              item.attachment
                            }
                          </div>

                        )}


                        <div className="message-read">

                          {item.read
                            ? "✓✓ Read"
                            : "✓ Sent"}

                        </div>

                      </div>

                    </div>

                  )
                )}

              </div>


              <div className="conversation-composer">

                <div className="conversation-composer-tools">

                  <button
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >
                    📎 Attach
                  </button>

                  <button
                    className={
                      internal
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setInternal(
                        (value) =>
                          !value
                      )
                    }
                  >
                    🔒 Internal Message
                  </button>

                  <input
                    ref={
                      fileInputRef
                    }
                    type="file"
                    hidden
                    onChange={
                      handleAttachment
                    }
                  />

                </div>


                {attachment && (

                  <div className="selected-attachment">

                    📎{" "}
                    {
                      attachment.name
                    }

                    <button
                      onClick={() =>
                        setAttachment(
                          null
                        )
                      }
                    >
                      ×
                    </button>

                  </div>

                )}


                <textarea
                  value={message}
                  onChange={(event) =>
                    setMessage(
                      event.target.value
                    )
                  }
                  placeholder={
                    internal
                      ? "Write an internal message..."
                      : "Write a message to the customer..."
                  }
                />


                <div className="conversation-composer-bottom">

                  <small>
                    {internal
                      ? "Only authorized internal users can see this message."
                      : "Message will be sent through the configured communication channel."}
                  </small>

                  <button
                    className="communication-primary-button"
                    onClick={
                      submitMessage
                    }
                  >
                    Send Message
                  </button>

                </div>

              </div>

            </section>


            <aside className="conversation-sidebar">

              <section className="communication-detail-card">

                <span>
                  COM-05
                </span>

                <h2>
                  Conversation Status
                </h2>

                <div className="conversation-info">

                  <div>
                    <small>
                      Channel
                    </small>

                    <strong>
                      {
                        conversation.channel
                      }
                    </strong>
                  </div>

                  <div>
                    <small>
                      Messages
                    </small>

                    <strong>
                      {
                        conversation.messages
                          .length
                      }
                    </strong>
                  </div>

                  <div>
                    <small>
                      Read State
                    </small>

                    <strong>
                      {
                        conversation.unread
                          ? "Unread"
                          : "Read"
                      }
                    </strong>
                  </div>

                </div>


                {conversation.unread && (

                  <button
                    className="communication-secondary-button full-width"
                    onClick={() =>
                      markConversationRead(
                        conversation.id
                      )
                    }
                  >
                    Mark as Read
                  </button>

                )}

              </section>


              <section className="communication-detail-card">

                <span>
                  COM-03
                </span>

                <h2>
                  Attachments
                </h2>

                <p>
                  Attach permitted files to
                  this conversation.
                </p>

                <button
                  className="communication-secondary-button full-width"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  + Attach File
                </button>

              </section>

            </aside>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default Conversation;