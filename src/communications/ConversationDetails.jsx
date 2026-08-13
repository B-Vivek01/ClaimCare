import {
  useRef,
  useState,
} from "react";
import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useCommunication,
} from "./CommunicationContext";

function ConversationDetails() {
  const { id } = useParams();

  const {
    conversations,
    sendMessage,
    markConversationRead,
    closeConversation,
  } = useCommunication();

  const conversation =
    conversations.find(
      (item) => item.id === id
    );

  const [message, setMessage] =
    useState("");

  const [attachments, setAttachments] =
    useState([]);

  const fileInputRef = useRef(null);

  if (!conversation) {
    return (
      <main className="communication-page">
        <div className="communication-container">

          <div className="communication-empty">
            <h2>
              Conversation not found
            </h2>

            <Link to="/communication/conversations">
              Back to conversations
            </Link>
          </div>

        </div>
      </main>
    );
  }

  const handleOpen = () => {
    markConversationRead(conversation.id);
  };

  const handleFiles = (event) => {
    const files = Array.from(
      event.target.files
    );

    const mappedFiles = files.map(
      (file) => ({
        name: file.name,
        size: file.size,
        type: file.type,
      })
    );

    setAttachments((previous) => [
      ...previous,
      ...mappedFiles,
    ]);
  };

  const handleSend = () => {
    sendMessage(
      conversation.id,
      message,
      attachments
    );

    setMessage("");
    setAttachments([]);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <main className="communication-page">
      <div className="communication-container">

        <div className="communication-header">

          <div>
            <span className="communication-badge">
              COM-04 / COM-05
            </span>

            <h1>
              {conversation.subject}
            </h1>

            <p>
              {conversation.customer} ·{" "}
              {conversation.type}
            </p>
          </div>

          <Link
            to="/communication/conversations"
            className="communication-secondary-button"
          >
            ← Messages
          </Link>

        </div>


        <section className="communication-card">

          <div className="communication-conversation-header">

            <div>
              <strong>
                {conversation.customer}
              </strong>

              <span>
                {conversation.type} conversation
              </span>
            </div>

            <div className="communication-conversation-header-actions">

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

              {conversation.status ===
                "Open" && (
                <button
                  onClick={() =>
                    closeConversation(
                      conversation.id
                    )
                  }
                >
                  Close
                </button>
              )}

              <button
                onClick={handleOpen}
              >
                Mark Read
              </button>

            </div>

          </div>


          <div
            className="communication-history"
            onClick={handleOpen}
          >

            {conversation.messages.map(
              (item) => (

                <div
                  key={item.id}
                  className={`communication-message ${
                    item.senderType ===
                    "Internal"
                      ? "internal"
                      : "customer"
                  }`}
                >

                  <div className="communication-message-meta">
                    <strong>
                      {item.sender}
                    </strong>

                    <small>
                      {new Date(
                        item.createdAt
                      ).toLocaleString()}
                    </small>
                  </div>

                  {item.text && (
                    <p>
                      {item.text}
                    </p>
                  )}

                  {item.attachments?.length >
                    0 && (
                    <div className="communication-attachments">

                      {item.attachments.map(
                        (file, index) => (
                          <div
                            key={`${file.name}-${index}`}
                            className="communication-attachment"
                          >
                            📎 {file.name}
                          </div>
                        )
                      )}

                    </div>
                  )}

                  <small className="communication-read-state">
                    {item.read
                      ? "✓ Read"
                      : "● Unread"}
                  </small>

                </div>

              )
            )}

          </div>


          {conversation.status ===
            "Open" && (
            <div className="communication-composer">

              {attachments.length >
                0 && (
                <div className="communication-selected-files">

                  {attachments.map(
                    (file, index) => (
                      <span
                        key={`${file.name}-${index}`}
                      >
                        📎 {file.name}

                        <button
                          onClick={() =>
                            setAttachments(
                              (previous) =>
                                previous.filter(
                                  (_, i) =>
                                    i !== index
                                )
                            )
                          }
                        >
                          ×
                        </button>
                      </span>
                    )
                  )}

                </div>
              )}


              <textarea
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                placeholder="Type your message..."
                rows="4"
              />


              <div className="communication-composer-actions">

                <div>

                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    hidden
                    onChange={handleFiles}
                  />

                  <button
                    className="communication-secondary-button"
                    onClick={() =>
                      fileInputRef.current?.click()
                    }
                  >
                    📎 Attach Files
                  </button>

                </div>

                <button
                  className="communication-primary-button"
                  onClick={handleSend}
                  disabled={
                    !message.trim() &&
                    attachments.length === 0
                  }
                >
                  Send Message
                </button>

              </div>

            </div>
          )}

        </section>

      </div>
    </main>
  );
}

export default ConversationDetails;