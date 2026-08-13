import {
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  useCommunication,
} from "./CommunicationContext";

const variables = [
  "{{customer_name}}",
  "{{claim_id}}",
  "{{claim_status}}",
  "{{policy_number}}",
  "{{renewal_date}}",
];

function Templates() {
  const {
    templates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
  } = useCommunication();

  const [
    channel,
    setChannel,
  ] = useState("All");

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    previewId,
    setPreviewId,
  ] = useState(null);

  const [
    name,
    setName,
  ] = useState("");

  const [
    newChannel,
    setNewChannel,
  ] = useState("Email");

  const [
    subject,
    setSubject,
  ] = useState("");

  const [
    body,
    setBody,
  ] = useState("");

  const filteredTemplates =
    useMemo(() => {
      return templates.filter(
        (template) =>
          channel === "All" ||
          template.channel ===
            channel
      );
    }, [
      templates,
      channel,
    ]);

  const createNewTemplate =
    () => {
      if (
        !name.trim() ||
        !body.trim()
      ) {
        return;
      }

      createTemplate({
        name,
        channel: newChannel,
        subject,
        body,
      });

      setName("");
      setSubject("");
      setBody("");
      setShowForm(false);
    };

  const renderPreview =
    (text) => {
      return text
        .replaceAll(
          "{{customer_name}}",
          "Rahul Kumar"
        )
        .replaceAll(
          "{{claim_id}}",
          "CLM-1001"
        )
        .replaceAll(
          "{{claim_status}}",
          "Under Review"
        )
        .replaceAll(
          "{{policy_number}}",
          "POL-2026-1001"
        )
        .replaceAll(
          "{{renewal_date}}",
          "25 August 2026"
        );
    };

  return (
    <>
      <Navbar />

      <main className="communication-page">

        <div className="communication-container">

          <div className="communication-header">

            <div>

              <span className="communication-badge">
                COMMUNICATION TEMPLATES
              </span>

              <h1>
                Templates
              </h1>

              <p>
                Create and manage reusable
                communication templates.
              </p>

            </div>

            <div>

              <Link
                to="/communication"
                className="communication-secondary-button"
              >
                ← Communication
              </Link>

              <button
                className="communication-primary-button template-header-button"
                onClick={() =>
                  setShowForm(
                    (value) =>
                      !value
                  )
                }
              >
                + New Template
              </button>

            </div>

          </div>


          {showForm && (

            <section className="template-form-card">

              <div className="communication-card-header">

                <div>

                  <span>
                    CREATE
                  </span>

                  <h2>
                    New Template
                  </h2>

                </div>

              </div>


              <div className="template-form-grid">

                <div>
                  <label>
                    Template Name
                  </label>

                  <input
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder="Example: Claim Approved"
                  />
                </div>


                <div>
                  <label>
                    Channel
                  </label>

                  <select
                    value={
                      newChannel
                    }
                    onChange={(event) =>
                      setNewChannel(
                        event.target.value
                      )
                    }
                  >
                    <option>
                      Email
                    </option>

                    <option>
                      SMS
                    </option>

                    <option>
                      WhatsApp
                    </option>
                  </select>
                </div>


                {newChannel ===
                  "Email" && (

                  <div>
                    <label>
                      Subject
                    </label>

                    <input
                      value={
                        subject
                      }
                      onChange={(event) =>
                        setSubject(
                          event.target.value
                        )
                      }
                      placeholder="Email subject"
                    />
                  </div>

                )}


                <div className="template-full-width">

                  <label>
                    Message Body
                  </label>

                  <textarea
                    value={
                      body
                    }
                    onChange={(event) =>
                      setBody(
                        event.target.value
                      )
                    }
                    placeholder="Write your template message..."
                  />

                </div>

              </div>


              <div className="template-token-section">

                <strong>
                  Variable Tokens
                </strong>

                <div>

                  {variables.map(
                    (variable) => (

                      <button
                        key={
                          variable
                        }
                        onClick={() =>
                          setBody(
                            (value) =>
                              `${value} ${variable}`
                          )
                        }
                      >
                        {variable}
                      </button>

                    )
                  )}

                </div>

              </div>


              <div className="template-form-actions">

                <button
                  className="communication-secondary-button"
                  onClick={() =>
                    setShowForm(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  className="communication-primary-button"
                  onClick={
                    createNewTemplate
                  }
                >
                  Save Template
                </button>

              </div>

            </section>

          )}


          <section className="communication-list-card">

            <div className="communication-toolbar">

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


            <div className="template-list">

              {filteredTemplates.map(
                (template) => (

                  <article
                    className="template-card"
                    key={
                      template.id
                    }
                  >

                    <div className="template-card-top">

                      <div>

                        <span>
                          {
                            template.channel
                          }
                        </span>

                        <h2>
                          {
                            template.name
                          }
                        </h2>

                      </div>

                      <span
                        className={
                          template.enabled
                            ? "template-enabled"
                            : "template-disabled"
                        }
                      >
                        {template.enabled
                          ? "Enabled"
                          : "Disabled"}
                      </span>

                    </div>


                    {template.subject && (

                      <div className="template-subject">
                        <strong>
                          Subject:
                        </strong>

                        {
                          template.subject
                        }
                      </div>

                    )}


                    <p className="template-body">
                      {
                        template.body
                      }
                    </p>


                    <div className="template-actions">

                      <button
                        onClick={() =>
                          setPreviewId(
                            previewId ===
                              template.id
                              ? null
                              : template.id
                          )
                        }
                      >
                        Preview
                      </button>

                      <button
                        onClick={() =>
                          updateTemplate(
                            template.id,
                            {
                              enabled:
                                !template.enabled,
                            }
                          )
                        }
                      >
                        {template.enabled
                          ? "Disable"
                          : "Enable"}
                      </button>

                      <button
                        className="danger"
                        onClick={() =>
                          deleteTemplate(
                            template.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>


                    {previewId ===
                      template.id && (

                      <div className="template-preview">

                        <span>
                          TEMPLATE PREVIEW
                        </span>

                        {template.subject && (
                          <strong>
                            {
                              renderPreview(
                                template.subject
                              )
                            }
                          </strong>
                        )}

                        <p>
                          {
                            renderPreview(
                              template.body
                            )
                          }
                        </p>

                      </div>

                    )}

                  </article>

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

export default Templates;