import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  useWorkflow,
} from "./WorkFlowContext";

function QueueDetails() {
  const {
    id,
  } = useParams();

  const navigate =
    useNavigate();

  const {
    workItems,
    assignWorkItem,
    changePriority,
    escalateWorkItem,
    updateStatus,
  } = useWorkflow();

  const item =
    workItems.find(
      (work) =>
        work.id === id
    );

  if (!item) {
    return (
      <div className="workflow-empty-page">

        <h1>
          Work Item Not Found
        </h1>

        <button
          className="workflow-primary-button"
          onClick={() =>
            navigate(
              "/workflow"
            )
          }
        >
          Back to Queue
        </button>

      </div>
    );
  }

  const percentage =
    Math.min(
      (item.elapsedHours /
        item.slaHours) *
        100,
      100
    );

  const remaining =
    Math.max(
      item.slaHours -
        item.elapsedHours,
      0
    );

  return (
    <>
      <Navbar />

      <main className="workflow-page">

        <div className="workflow-container">

          <div className="workflow-header">

            <div>

              <span className="workflow-badge">
                WORK ITEM
              </span>

              <h1>
                {item.id}
              </h1>

              <p>
                {item.type} ·{" "}
                {item.customer}
              </p>

            </div>

            <Link
              to="/workflow"
              className="workflow-secondary-button"
            >
              ← Queue
            </Link>

          </div>


          <div className="workflow-details-grid">

            <section className="workflow-detail-card">

              <div className="workflow-card-header">

                <div>

                  <span>
                    WORKFLOW
                  </span>

                  <h2>
                    Work Item Details
                  </h2>

                </div>

              </div>


              <div className="workflow-detail-grid">

                <Info
                  label="Claim"
                  value={item.id}
                />

                <Info
                  label="Customer"
                  value={
                    item.customer
                  }
                />

                <Info
                  label="Claim Type"
                  value={
                    item.type
                  }
                />

                <Info
                  label="Team"
                  value={
                    item.team
                  }
                />

                <Info
                  label="Created"
                  value={
                    new Date(
                      item.createdAt
                    ).toLocaleString()
                  }
                />

                <Info
                  label="Current Status"
                  value={
                    item.status
                  }
                />

              </div>

            </section>


            <section className="workflow-detail-card">

              <div className="workflow-card-header">

                <div>

                  <span>
                    WF-06
                  </span>

                  <h2>
                    SLA Timer
                  </h2>

                </div>

              </div>


              <div className="workflow-sla-large">

                <strong>
                  {remaining}h
                </strong>

                <span>
                  remaining
                </span>

              </div>


              <div className="workflow-sla-bar large">

                <span
                  style={{
                    width: `${percentage}%`,
                  }}
                />

              </div>


              <div className="workflow-sla-summary">

                <span>
                  Elapsed
                  <strong>
                    {
                      item.elapsedHours
                    }h
                  </strong>
                </span>

                <span>
                  SLA
                  <strong>
                    {
                      item.slaHours
                    }h
                  </strong>
                </span>

                <span>
                  Used
                  <strong>
                    {Math.round(
                      percentage
                    )}
                    %
                  </strong>
                </span>

              </div>

              {percentage >=
                75 && (
                <div className="workflow-warning-box">
                  SLA threshold is
                  approaching.
                </div>
              )}

            </section>


            <section className="workflow-detail-card">

              <div className="workflow-card-header">

                <div>

                  <span>
                    WF-03
                  </span>

                  <h2>
                    Assignment
                  </h2>

                </div>

              </div>


              <label className="workflow-label">
                Team
              </label>

              <select
                className="workflow-select"
                value={
                  item.team
                }
                onChange={() => {}}
              >
                <option>
                  {
                    item.team
                  }
                </option>
              </select>


              <label className="workflow-label">
                Specialist
              </label>

              <select
                className="workflow-select"
                value={
                  item.assignedTo
                }
                onChange={(event) =>
                  assignWorkItem(
                    item.id,
                    event.target.value
                  )
                }
              >

                <option value="Unassigned">
                  Unassigned
                </option>

                <option value="Arjun">
                  Arjun
                </option>

                <option value="Meena">
                  Meena
                </option>

                <option value="Rahul">
                  Rahul
                </option>

                <option value="Priya">
                  Priya
                </option>

              </select>

            </section>


            <section className="workflow-detail-card">

              <div className="workflow-card-header">

                <div>

                  <span>
                    CLM-27
                  </span>

                  <h2>
                    Priority
                  </h2>

                </div>

              </div>


              <div className="workflow-priority-buttons">

                {[
                  "High",
                  "Medium",
                  "Low",
                ].map(
                  (value) => (

                    <button
                      key={value}
                      className={
                        item.priority ===
                        value
                          ? "selected"
                          : ""
                      }
                      onClick={() =>
                        changePriority(
                          item.id,
                          value
                        )
                      }
                    >
                      {value}
                    </button>

                  )
                )}

              </div>

            </section>


            <section className="workflow-detail-card">

              <div className="workflow-card-header">

                <div>

                  <span>
                    WORKFLOW
                  </span>

                  <h2>
                    Status
                  </h2>

                </div>

              </div>


              <select
                className="workflow-select"
                value={
                  item.status
                }
                onChange={(event) =>
                  updateStatus(
                    item.id,
                    event.target.value
                  )
                }
              >

                <option value="New">
                  New
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Pending Documents">
                  Pending Documents
                </option>

                <option value="Resolved">
                  Resolved
                </option>

              </select>

            </section>


            <section className="workflow-detail-card">

              <div className="workflow-card-header">

                <div>

                  <span>
                    WF-08
                  </span>

                  <h2>
                    Escalation
                  </h2>

                </div>

              </div>


              {item.escalation ? (

                <div className="workflow-escalation-active">
                  ⚠ This work item is
                  escalated.
                </div>

              ) : (

                <button
                  className="workflow-danger-button"
                  onClick={() =>
                    escalateWorkItem(
                      item.id
                    )
                  }
                >
                  Escalate Work Item
                </button>

              )}

            </section>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}

function Info({
  label,
  value,
}) {
  return (
    <div className="workflow-info">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

export default QueueDetails;