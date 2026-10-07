import { useDocuments } from "../document/DocumentContext";
import { useAuth } from "../auth/AuthContext";
import { useProfiles } from "../backend/useProfiles";
import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useClaims } from "./ClaimContext";

function ClaimDetails() {
  const { id } = useParams();
  const { profile, user } = useAuth();
  const [people]=useProfiles();
  const [busy,setBusy]=useState(false);
  const staff = ["admin", "operations"].includes(profile?.role);

  const navigate =
    useNavigate();

  const {
    getClaim,
    updateClaim,
    updateClaimStatus,
    addInternalNote,
    addTag,
    removeTag,
  } = useClaims();

  const originalClaim = getClaim(id);
  const {documents}=useDocuments();
  const claim=originalClaim?{...originalClaim,documents:documents.filter(item=>item.claimId===id).map(item=>({...item,status:item.reviewStatus}))}:undefined;

  const [note, setNote] =
    useState("");

  const [tag, setTag] =
    useState("");

  const [message, setMessage] =
    useState("");

  const selectedSpecialist = claim?.assignedSpecialistId || "";
  const priority = claim?.priority || "Medium";

  const specialists = people.filter(person=>['admin','operations'].includes(person.role)&&person.status==='Active');

  if (!claim) {
    return (
      <>
        <Navbar />

        <main className="claim-page">

          <div className="claim-empty-page">

            <h1>
              Claim Not Found
            </h1>

            <button
              className="claim-primary-button"
              onClick={() =>
                navigate(
                  "/claims"
                )
              }
            >
              Back to Claims
            </button>

          </div>

        </main>

        <Footer />
      </>
    );
  }

  const handleAddNote =
    async () => {
      if (busy || !note.trim()) {
        return;
      }

      setBusy(true);
      const saved=await addInternalNote(
        id,
        note.trim()
      );

      if(saved) setNote("");
      setBusy(false);
    };

  const handleAddTag =
    async () => {
      if (busy || !tag.trim()) {
        return;
      }

      setBusy(true);
      const saved=await addTag(
        id,
        tag.trim()
      );

      if(saved) setTag("");
      setBusy(false);
    };

  const handlePriority =
    async (value) => {
      if(busy) return;
      setBusy(true);
      await updateClaim(id, {
        priority: value,
      });

      setBusy(false);
    };

  const handleSpecialist =
    async (value) => {
      if(busy) return;
      setBusy(true);
      const person=specialists.find(item=>item.id===value);
      await updateClaim(id, {
        assignedSpecialistId: person?.id || null,
        assignedSpecialist: person?.name || person?.email || null,
      });

      setBusy(false);
    };

  const handleSendMessage =
    async () => {
      if (busy || !message.trim()) {
        return;
      }

      setBusy(true);
      const saved=await updateClaim(id, previous=>({
        messages: [
          ...(previous.messages ||
            []),

          {
            id: `MSG-${crypto.randomUUID()}`,

            sender:
              profile?.name || user?.email,
            senderId: user?.uid,

            message:
              message.trim(),

            date: new Date()
              .toISOString()
              .split("T")[0],
          },
        ],
      }));

      if(saved) setMessage("");
      setBusy(false);
    };

  return (
    <>

      <main className="claim-page">

        <div className="claim-container">

          {/* HEADER */}

          <div className="claim-details-header">

            <div>

              <span className="claim-badge">
                CLAIM DETAILS
              </span>

              <h1>
                {claim.claimNumber}
              </h1>

              <p>
                Policy:
                {" "}
                {claim.policyNumber}
              </p>

            </div>

            <div className="claim-header-actions">

              <Link
                to="/claims"
                className="claim-secondary-button"
              >
                ← Claims
              </Link>

              {claim.status ===
                "Closed" && (

                <Link
                  to={`/claims/${claim.id}/closure`}
                  className="claim-primary-button"
                >
                  Closure
                </Link>

              )}

            </div>

          </div>


          {/* CURRENT STATUS */}

          <section className="claim-status-banner">

            <div>

              <span>
                CURRENT STATUS
              </span>

              <strong
                className={`claim-status large ${getStatusClass(
                  claim.status
                )}`}
              >
                {claim.status}
              </strong>

            </div>

            <div>

              <span>
                PRIORITY
              </span>

              <strong>
                {claim.priority}
              </strong>

            </div>

            <div>

              <span>
                SLA
              </span>

              <strong>
                {claim.sla?.status}
              </strong>

              {claim.sla
                ?.remainingHours !==
                null && (

                <small>
                  {
                    claim.sla
                      .remainingHours
                  }{" "}
                  hours remaining
                </small>

              )}

            </div>

          </section>


          {/* PROGRESS */}

          <section className="claim-detail-card">

            <div className="claim-card-heading">

              <div>

                <span>
                  CLM-12
                </span>

                <h2>
                  Claim Progress
                </h2>

              </div>

              <strong>
                {claim.progress}%
              </strong>

            </div>

            <div className="claim-large-progress">

              <div>

                <span
                  style={{
                    width: `${claim.progress}%`,
                  }}
                />

              </div>

            </div>

            <p className="claim-next-step">

              <strong>
                Expected next step:
              </strong>

              {" "}

              {claim.expectedNextStep}

            </p>

          </section>


          {/* SUMMARY */}

          <section className="claim-detail-card">

            <div className="claim-card-heading">

              <div>

                <span>
                  CLM-11
                </span>

                <h2>
                  Claim Summary
                </h2>

              </div>

            </div>

            <div className="claim-summary-grid">

              <Summary
                label="Claim Number"
                value={
                  claim.claimNumber
                }
              />

              <Summary
                label="Policy Number"
                value={
                  claim.policyNumber
                }
              />

              <Summary
                label="Customer"
                value={
                  claim.customerName
                }
              />

              <Summary
                label="Category"
                value={
                  claim.category
                }
              />

              <Summary
                label="Template"
                value={
                  claim.template
                }
              />

              <Summary
                label="Incident Date"
                value={
                  claim.incidentDate ||
                  "—"
                }
              />

              <Summary
                label="Incident Location"
                value={
                  claim.incidentLocation ||
                  "—"
                }
              />

              <Summary
                label="Assigned Specialist"
                value={
                  claim.assignedSpecialist ||
                  "Not assigned"
                }
              />

            </div>

          </section>


          {/* OUTSTANDING ACTIONS */}

          <section className="claim-detail-card">

            <div className="claim-card-heading">

              <div>

                <span>
                  CLM-16
                </span>

                <h2>
                  Outstanding Actions
                </h2>

              </div>

            </div>

            {claim.outstandingActions
              ?.length ? (

              <div className="claim-task-list">

                {claim.outstandingActions.map(
                  (task) => (

                    <div
                      className="claim-task"
                      key={task.id}
                    >

                      <div>

                        <span>
                          !
                        </span>

                        <strong>
                          {task.title}
                        </strong>

                      </div>

                      <button
                        className="claim-small-button"
                        onClick={() =>
                          updateClaim(
                            id,
                            {
                              outstandingActions:
                                claim.outstandingActions.map(
                                  (
                                    item
                                  ) =>
                                    item.id ===
                                    task.id
                                      ? {
                                          ...item,
                                          completed:
                                            true,
                                        }
                                      : item
                                ),
                            }
                          )
                        }
                      >
                        Complete
                      </button>

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="claim-empty-inline">
                No outstanding actions.
              </div>

            )}

          </section>


          {/* ASSIGNMENT / PRIORITY */}

          <section className="claim-detail-card">

            <div className="claim-card-heading">

              <div>

                <span>
                  OPERATIONS
                </span>

                <h2>
                  Assignment & Priority
                </h2>

              </div>

            </div>

            <div className="claim-form-grid">

              <div className="claim-field">

                <label>
                  Assigned Specialist
                </label>

                <select
                  disabled={!staff || busy}
                  value={
                    selectedSpecialist
                  }
                  onChange={(event) =>
                    handleSpecialist(
                      event.target.value
                    )
                  }
                >

                  <option value="">
                    Not Assigned
                  </option>

                  {specialists.map(
                    (person) => (

                      <option
                        key={person.id}
                        value={person.id}
                      >
                        {person.name || person.email}
                      </option>

                    )
                  )}

                </select>

              </div>


              <div className="claim-field">

                <label>
                  Priority
                </label>

                <select
                  disabled={!staff || busy}
                  value={
                    priority
                  }
                  onChange={(event) =>
                    handlePriority(
                      event.target.value
                    )
                  }
                >

                  <option value="Low">
                    Low
                  </option>

                  <option value="Medium">
                    Medium
                  </option>

                  <option value="High">
                    High
                  </option>

                  <option value="Critical">
                    Critical
                  </option>

                </select>

              </div>

            </div>


            <div className="claim-operation-actions">

              <button
                disabled={!staff || ['Closed','Rejected'].includes(claim.status)} className="claim-secondary-button"
                onClick={() =>
                  updateClaimStatus(
                    id,
                    "Escalated"
                  )
                }
              >
                Escalate Claim
              </button>

              <button
                disabled={!staff || ['Closed','Rejected'].includes(claim.status)} className="claim-primary-button"
                onClick={() =>
                  updateClaimStatus(
                    id,
                    "Under Review"
                  )
                }
              >
                Mark Under Review
              </button>

            </div>

          </section>


          {/* TAGS */}

          <section className="claim-detail-card">

            <div className="claim-card-heading">

              <div>

                <span>
                  CLM-30
                </span>

                <h2>
                  Claim Tags
                </h2>

              </div>

            </div>

            <div className="claim-tags">

              {claim.tags?.map(
                (item) => (

                  <span
                    className="claim-tag"
                    key={item}
                  >

                    {item}

                    <button
                      onClick={() =>
                        removeTag(
                          id,
                          item
                        )
                      }
                    >
                      ×
                    </button>

                  </span>

                )
              )}

            </div>

            <div className="claim-add-tag">

              <input
                value={tag}
                onChange={(event) =>
                  setTag(
                    event.target.value
                  )
                }
                placeholder="Add tag"
              />

              <button
                className="claim-small-button"
                onClick={
                  handleAddTag
                }
              >
                Add
              </button>

            </div>

          </section>


          {/* INTERNAL NOTES */}
          {staff && <>

          <section className="claim-detail-card">

            <div className="claim-card-heading">

              <div>

                <span>
                  CLM-29
                </span>

                <h2>
                  Internal Notes
                </h2>

              </div>

            </div>

            <div className="claim-internal-warning">

              Internal notes are visible only to
              authorized operations users.

            </div>

            <div className="claim-note-form">

              <textarea
                value={note}
                onChange={(event) =>
                  setNote(
                    event.target.value
                  )
                }
                placeholder="Add an internal note..."
              />

              <button
                className="claim-primary-button"
                onClick={
                  handleAddNote
                }
              >
                Add Note
              </button>

            </div>

            <div className="claim-note-list">

              {claim.internalNotes?.map(
                (item) => (

                  <div
                    className="claim-note"
                    key={item.id}
                  >

                    <strong>
                      {item.author}
                    </strong>

                    <span>
                      {item.date}
                    </span>

                    <p>
                      {item.note}
                    </p>

                  </div>

                )
              )}

            </div>

          </section>
          </>}


          {/* MESSAGES */}

          <section className="claim-detail-card">

            <div className="claim-card-heading">

              <div>

                <span>
                  CLM-17
                </span>

                <h2>
                  Messages
                </h2>

              </div>

            </div>

            <div className="claim-message-list">

              {claim.messages?.map(
                (item) => (

                  <div
                    className="claim-message"
                    key={item.id}
                  >

                    <strong>
                      {item.sender}
                    </strong>

                    <span>
                      {item.date}
                    </span>

                    <p>
                      {item.message}
                    </p>

                  </div>

                )
              )}

            </div>

            <div className="claim-message-form">

              <input
                value={message}
                onChange={(event) =>
                  setMessage(
                    event.target.value
                  )
                }
                placeholder="Write a message..."
              />

              <button
                className="claim-primary-button"
                onClick={
                  handleSendMessage
                }
              >
                Send
              </button>

            </div>

          </section>


          {/* DOCUMENTS */}

          <section className="claim-detail-card">

            <div className="claim-card-heading">

              <div>

                <span>
                  CLM-18
                </span>

                <h2>
                  Related Documents
                </h2>

              </div>

            </div>

            <Link to={`/documents/upload?claim=${id}`}>Upload a claim document</Link>
            {claim.documents?.length ? (

              <div className="claim-document-list">

                {claim.documents.map(
                  (document) => (

                    <div
                      className="claim-document"
                      key={document.id}
                    >

                      <span>
                        📄
                      </span>

                      <div>

                        <strong>
                          <Link to={`/documents/${document.id}`}>{document.name}</Link>
                        </strong>

                        <small>
                          {document.type}
                          {" · "}
                          {document.status}
                        </small>

                      </div>

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="claim-empty-inline">
                No related documents.
              </div>

            )}

          </section>


          {/* NAVIGATION */}

          <div className="claim-detail-navigation">

            <Link
              to={`/claims/${id}/timeline`}
              className="claim-secondary-button"
            >
              View Timeline
            </Link>

            <Link
              to={`/claims/${id}/closure`}
              className="claim-secondary-button"
            >
              Closure
            </Link>

            <Link
              to={`/claims/${id}/audit`}
              className="claim-secondary-button"
            >
              Audit History
            </Link>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}


function Summary({
  label,
  value,
}) {
  return (
    <div className="claim-summary-item">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}

function getStatusClass(
  status
) {
  return status
    .toLowerCase()
    .replaceAll(
      " ",
      "-"
    );
}

export default ClaimDetails;

