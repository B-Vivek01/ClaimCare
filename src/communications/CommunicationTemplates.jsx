import {
  useState,
} from "react";
import { Link } from "react-router-dom";

import {
  useCommunication,
} from "./CommunicationContext";

const variables = [
  "{{customerName}}",
  "{{claimId}}",
  "{{claimStatus}}",
  "{{policyNumber}}",
];

function CommunicationTemplates() {
  const {
    templates,
    addTemplate,
    updateTemplate,
    deleteTemplate,
  } = useCommunication();

  const [channel, setChannel] =
    useState("Email");

  const [name, setName] =
    useState("");

  const [subject, setSubject] =
    useState("");

  const [body, setBody] =
    useState("");

  const [editingId, setEditingId] =
    useState(null);

  const [preview, setPreview] =
    useState(null);

  const resetForm = () => {
    setName("");
    setSubject("");
    setBody("");
    setEditingId(null);
  };

  const insertVariable = (variable) => {
    setBody(
      (previous) =>
        `${previous}${previous ? " " : ""}${variable}`
    );
  };

  const saveTemplate = () => {
    if (!name.trim() || !body.trim()) {
      return;
    }

    const data = {
      name,
      channel,
      subject:
        channel === "Email"
          ? subject
          : "",
      body,
      status: "Active",
    };

    if (editingId) {
      updateTemplate(
        editingId,
        data
      );
    } else {
      addTemplate(data);
    }

    resetForm();
  };

  const editTemplate = (template) => {
    setEditingId(template.id);
    setName(template.name);
    setChannel(template.channel);
    setSubject(template.subject || "");
    setBody(template.body);
  };

  const renderPreview = (text) => {
    return text
      .replace(
        "{{customerName}}",
        "Rahul Kumar"
      )
      .replace(
        "{{claimId}}",
        "CLM-1001"
      )
      .replace(
        "{{claimStatus}}",
        "Under Review"
      )
      .replace(
        "{{policyNumber}}",
        "POL-2045"
      );
  };

  return (
    <main className="communication-page">
      <div className="communication-container">

        <div className="communication-header">

          <div>
            <span className="communication-badge">
              COM-06 → COM-10
            </span>

            <h1>
              Communication Templates
            </h1>

            <p>
              Create, edit and preview communication
              templates.
            </p>
          </div>

          <Link
            to="/communication"
            className="communication-secondary-button"
          >
            ← Communication Center
          </Link>

        </div>


        <div className="communication-template-layout">

          <section className="communication-card">

            <div className="communication-card-header">
              <div>
                <span>
                  TEMPLATE EDITOR
                </span>

                <h2>
                  {editingId
                    ? "Edit Template"
                    : "Create Template"}
                </h2>
              </div>
            </div>


            <div className="communication-form">

              <label>
                Template Name

                <input
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter template name"
                />
              </label>


              <label>
                Channel

                <select
                  value={channel}
                  onChange={(e) =>
                    setChannel(e.target.value)
                  }
                >
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
              </label>


              {channel === "Email" && (
                <label>
                  Subject

                  <input
                    value={subject}
                    onChange={(e) =>
                      setSubject(
                        e.target.value
                      )
                    }
                    placeholder="Email subject"
                  />
                </label>
              )}


              <label>
                Message

                <textarea
                  value={body}
                  onChange={(e) =>
                    setBody(e.target.value)
                  }
                  rows="7"
                  placeholder="Write template content..."
                />
              </label>


              <div className="communication-variable-section">

                <span>
                  VARIABLE TOKENS
                </span>

                <div>
                  {variables.map(
                    (variable) => (
                      <button
                        key={variable}
                        onClick={() =>
                          insertVariable(
                            variable
                          )
                        }
                      >
                        {variable}
                      </button>
                    )
                  )}
                </div>

              </div>


              <div className="communication-form-actions">

                <button
                  className="communication-primary-button"
                  onClick={saveTemplate}
                >
                  {editingId
                    ? "Update Template"
                    : "Create Template"}
                </button>

                {editingId && (
                  <button
                    className="communication-secondary-button"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}

              </div>

            </div>

          </section>


          <section className="communication-card">

            <div className="communication-card-header">

              <div>
                <span>
                  PREVIEW
                </span>

                <h2>
                  Template Preview
                </h2>
              </div>

            </div>

            <div className="communication-template-preview">

              {channel === "Email" &&
                subject && (
                  <div>
                    <strong>
                      Subject:
                    </strong>{" "}
                    {renderPreview(subject)}
                  </div>
                )}

              <p>
                {body
                  ? renderPreview(body)
                  : "Template preview will appear here."}
              </p>

            </div>

          </section>

        </div>


        <section className="communication-card">

          <div className="communication-card-header">

            <div>
              <span>
                TEMPLATE LIBRARY
              </span>

              <h2>
                Available Templates
              </h2>
            </div>

          </div>


          <div className="communication-template-list">

            {templates.map(
              (template) => (

                <div
                  key={template.id}
                  className="communication-template-item"
                >

                  <div>

                    <span>
                      {template.channel}
                    </span>

                    <h3>
                      {template.name}
                    </h3>

                    <p>
                      {template.body}
                    </p>

                  </div>


                  <div className="communication-template-actions">

                    <button
                      onClick={() =>
                        editTemplate(
                          template
                        )
                      }
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        setPreview(
                          template
                        )
                      }
                    >
                      Preview
                    </button>

                    <button
                      onClick={() =>
                        deleteTemplate(
                          template.id
                        )
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>
              )
            )}

          </div>

        </section>


        {preview && (
          <div className="communication-modal-overlay">

            <div className="communication-modal">

              <div className="communication-modal-header">

                <h2>
                  {preview.name}
                </h2>

                <button
                  onClick={() =>
                    setPreview(null)
                  }
                >
                  ×
                </button>

              </div>

              <span>
                {preview.channel}
              </span>

              {preview.subject && (
                <p>
                  <strong>
                    Subject:
                  </strong>{" "}
                  {renderPreview(
                    preview.subject
                  )}
                </p>
              )}

              <div className="communication-template-preview">
                {renderPreview(
                  preview.body
                )}
              </div>

            </div>

          </div>
        )}

      </div>
    </main>
  );
}

export default CommunicationTemplates;