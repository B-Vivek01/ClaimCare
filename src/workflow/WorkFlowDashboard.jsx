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
  useWorkflow,
} from "./WorkflowContext";

function WorkflowDashboard() {
  const navigate =
    useNavigate();

  const {
    workItems,
  } = useWorkflow();

  const [
    activeQueue,
    setActiveQueue,
  ] = useState("All");

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    priority,
    setPriority,
  ] = useState("All");

  const [
    status,
    setStatus,
  ] = useState("All");

  const queues = [
    "All",
    "Medical Claims",
    "Motor Claims",
    "Property Claims",
  ];

  const filteredItems =
    useMemo(() => {
      return workItems.filter(
        (item) => {
          const matchesQueue =
            activeQueue === "All" ||
            item.team ===
              activeQueue;

          const matchesPriority =
            priority === "All" ||
            item.priority ===
              priority;

          const matchesStatus =
            status === "All" ||
            item.status ===
              status;

          const text =
            `${item.id}
            ${item.customer}
            ${item.type}
            ${item.assignedTo}`
              .toLowerCase();

          const matchesSearch =
            text.includes(
              search.toLowerCase()
            );

          return (
            matchesQueue &&
            matchesPriority &&
            matchesStatus &&
            matchesSearch
          );
        }
      );
    }, [
      workItems,
      activeQueue,
      priority,
      status,
      search,
    ]);

  const agingCount =
    workItems.filter(
      (item) =>
        item.elapsedHours >=
        item.slaHours
    ).length;

  const warningCount =
    workItems.filter(
      (item) =>
        item.elapsedHours >=
          item.slaHours * 0.75 &&
        item.elapsedHours <
          item.slaHours
    ).length;

  const escalatedCount =
    workItems.filter(
      (item) =>
        item.escalation
    ).length;

  const assignedCount =
    workItems.filter(
      (item) =>
        item.assignedTo !==
        "Unassigned"
    ).length;

  return (
    <>
      <Navbar />

      <main className="workflow-page">

        <div className="workflow-container">

          <div className="workflow-header">

            <div>
              <span className="workflow-badge">
                OPERATIONS PORTAL
              </span>

              <h1>
                Workflow Operations
              </h1>

              <p>
                Manage queues, assignments,
                SLA activity and escalations.
              </p>
            </div>

            <button
              className="workflow-secondary-button"
              onClick={() =>
                navigate(
                  "/workflow/rules"
                )
              }
            >
              Assignment Rules
            </button>

          </div>


          <div className="workflow-stat-grid">

            <Stat
              label="Total Work"
              value={
                workItems.length
              }
            />

            <Stat
              label="Assigned"
              value={
                assignedCount
              }
            />

            <Stat
              label="SLA Warning"
              value={
                warningCount
              }
            />

            <Stat
              label="Escalated"
              value={
                escalatedCount
              }
            />

          </div>


          <section className="workflow-queue-card">

            <div className="workflow-card-header">

              <div>
                <span>
                  WF-01
                </span>

                <h2>
                  Operational Queues
                </h2>
              </div>

              <strong>
                {workItems.length} items
              </strong>

            </div>


            <div className="workflow-queue-tabs">

              {queues.map(
                (queue) => (

                  <button
                    key={queue}
                    className={
                      activeQueue ===
                      queue
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setActiveQueue(
                        queue
                      )
                    }
                  >
                    {queue}

                    <span>
                      {
                        queue ===
                        "All"
                          ? workItems.length
                          : workItems.filter(
                              (
                                item
                              ) =>
                                item.team ===
                                queue
                            ).length
                      }
                    </span>

                  </button>

                )
              )}

            </div>

          </section>


          <section className="workflow-list-card">

            <div className="workflow-toolbar">

              <div className="workflow-search">
                🔍

                <input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search claim, customer or specialist..."
                />
              </div>

              <select
                value={priority}
                onChange={(event) =>
                  setPriority(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Priority
                </option>

                <option value="High">
                  High
                </option>

                <option value="Medium">
                  Medium
                </option>

                <option value="Low">
                  Low
                </option>
              </select>

              <select
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All Status
                </option>

                <option value="New">
                  New
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Pending Documents">
                  Pending Documents
                </option>
              </select>

            </div>


            <div className="workflow-table-wrapper">

              {filteredItems.length ===
              0 ? (

                <div className="workflow-empty">

                  <h3>
                    No work items found
                  </h3>

                  <p>
                    Change your queue,
                    filters or search.
                  </p>

                </div>

              ) : (

                <table className="workflow-table">

                  <thead>
                    <tr>
                      <th>
                        Claim
                      </th>

                      <th>
                        Customer
                      </th>

                      <th>
                        Team
                      </th>

                      <th>
                        Priority
                      </th>

                      <th>
                        Assigned To
                      </th>

                      <th>
                        SLA
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>

                    {filteredItems.map(
                      (item) => {

                        const slaPercentage =
                          (item.elapsedHours /
                            item.slaHours) *
                          100;

                        const isAging =
                          item.elapsedHours >=
                          item.slaHours;

                        const isWarning =
                          slaPercentage >=
                            75 &&
                          !isAging;

                        return (
                          <tr
                            key={
                              item.id
                            }
                            className={
                              isAging
                                ? "aging-row"
                                : ""
                            }
                          >

                            <td>
                              <Link
                                to={`/workflow/${item.id}`}
                                className="workflow-claim"
                              >
                                {
                                  item.id
                                }
                              </Link>

                              <small>
                                {
                                  item.type
                                }
                              </small>
                            </td>

                            <td>
                              {
                                item.customer
                              }
                            </td>

                            <td>
                              {
                                item.team
                              }
                            </td>

                            <td>
                              <Priority
                                value={
                                  item.priority
                                }
                              />
                            </td>

                            <td>
                              {
                                item.assignedTo
                              }
                            </td>

                            <td>

                              <div className="workflow-sla">

                                <strong
                                  className={
                                    isAging
                                      ? "sla-danger"
                                      : isWarning
                                      ? "sla-warning"
                                      : "sla-normal"
                                  }
                                >
                                  {Math.max(
                                    item.slaHours -
                                      item.elapsedHours,
                                    0
                                  )}
                                  h left
                                </strong>

                                <div className="workflow-sla-bar">
                                  <span
                                    style={{
                                      width: `${Math.min(
                                        slaPercentage,
                                        100
                                      )}%`,
                                    }}
                                  />
                                </div>

                                {isAging && (
                                  <small>
                                    Aging
                                  </small>
                                )}

                                {isWarning &&
                                  !isAging && (
                                    <small>
                                      SLA Warning
                                    </small>
                                  )}

                              </div>

                            </td>

                            <td>

                              <span className="workflow-status">
                                {
                                  item.status
                                }
                              </span>

                              {item.escalation && (
                                <span className="workflow-escalated">
                                  Escalated
                                </span>
                              )}

                            </td>

                            <td>

                              <Link
                                to={`/workflow/${item.id}`}
                                className="workflow-view"
                              >
                                Open
                              </Link>

                            </td>

                          </tr>
                        );
                      }
                    )}

                  </tbody>

                </table>

              )}

            </div>

          </section>


          <section className="workflow-shortcuts">

            <button
              onClick={() =>
                setActiveQueue(
                  "All"
                )
              }
            >
              <strong>
                Personal Queue
              </strong>

              <span>
                WF-04
              </span>
            </button>

            <button
              onClick={() =>
                setActiveQueue(
                  "All"
                )
              }
            >
              <strong>
                Aging Queue
              </strong>

              <span>
                {agingCount} items
              </span>
            </button>

            <button
              onClick={() =>
                navigate(
                  "/workflow/rules"
                )
              }
            >
              <strong>
                Rule Engine
              </strong>

              <span>
                WF-11
              </span>
            </button>

            <button
              onClick={() =>
                navigate(
                  "/workflow/settings"
                )
              }
            >
              <strong>
                Workflow Settings
              </strong>

              <span>
                Configure
              </span>
            </button>

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
    <div className="workflow-stat-card">
      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}

function Priority({
  value,
}) {
  return (
    <span
      className={`workflow-priority ${value.toLowerCase()}`}
    >
      {value}
    </span>
  );
}

export default WorkflowDashboard;