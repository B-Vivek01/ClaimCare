import {
  useMemo,
  useState,
} from "react";

import {
  Link,
  useNavigate,
} from "react-router-dom";

import Footer from "../components/Footer";

import {
  useWorkflow,
} from "../workflow/WorkFlowContext";

function WorkQueue() {
  const navigate =
    useNavigate();

  const {
    workItems,
  } = useWorkflow();

  const [
    selectedQueue,
    setSelectedQueue,
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

  const [
    view,
    setView,
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
          const searchText =
            `${item.id}
            ${item.customer}
            ${item.type}
            ${item.assignedTo}
            ${item.team}`
              .toLowerCase();

          const matchesSearch =
            searchText.includes(
              search.toLowerCase()
            );

          const matchesQueue =
            selectedQueue === "All" ||
            item.team ===
              selectedQueue;

          const matchesPriority =
            priority === "All" ||
            item.priority ===
              priority;

          const matchesStatus =
            status === "All" ||
            item.status ===
              status;

          const matchesView =
            view === "All"
              ? true
              : view === "Unassigned"
              ? item.assignedTo ===
                "Unassigned"
              : view === "Aging"
              ? item.elapsedHours >=
                item.slaHours
              : view === "SLA Warning"
              ? item.elapsedHours >=
                  item.slaHours *
                    0.75 &&
                item.elapsedHours <
                  item.slaHours
              : true;

          return (
            matchesSearch &&
            matchesQueue &&
            matchesPriority &&
            matchesStatus &&
            matchesView
          );
        }
      );
    }, [
      workItems,
      search,
      selectedQueue,
      priority,
      status,
      view,
    ]);

  const totalWork =
    workItems.length;

  const unassigned =
    workItems.filter(
      (item) =>
        item.assignedTo ===
        "Unassigned"
    ).length;

  const aging =
    workItems.filter(
      (item) =>
        item.elapsedHours >=
        item.slaHours
    ).length;

  const slaWarning =
    workItems.filter(
      (item) =>
        item.elapsedHours >=
          item.slaHours * 0.75 &&
        item.elapsedHours <
          item.slaHours
    ).length;

  const escalated =
    workItems.filter(
      (item) =>
        item.escalation
    ).length;

  return (
    <>

      <main className="operations-page">

        <div className="operations-container">

          <div className="operations-header">

            <div>

              <span className="operations-badge">
                OPS-01 · WORK QUEUE
              </span>

              <h1>
                Work Queue
              </h1>

              <p>
                Review operational work,
                queue status, assignments
                and SLA activity.
              </p>

            </div>

            <Link
              to="/ops"
              className="operations-secondary-button"
            >
              ← Operations Portal
            </Link>

          </div>


          <section className="workqueue-summary">

            <QueueStat
              label="Total Work"
              value={
                totalWork
              }
              active={
                view === "All"
              }
              onClick={() => {
                setView("All");
                setSelectedQueue(
                  "All"
                );
              }}
            />

            <QueueStat
              label="Unassigned"
              value={
                unassigned
              }
              active={
                view === "Unassigned"
              }
              onClick={() =>
                setView(
                  "Unassigned"
                )
              }
            />

            <QueueStat
              label="SLA Warning"
              value={
                slaWarning
              }
              active={
                view === "SLA Warning"
              }
              onClick={() =>
                setView(
                  "SLA Warning"
                )
              }
            />

            <QueueStat
              label="Aging"
              value={
                aging
              }
              active={
                view === "Aging"
              }
              onClick={() =>
                setView("Aging")
              }
            />

            <QueueStat
              label="Escalated"
              value={
                escalated
              }
              active={false}
              onClick={() => {}}
            />

          </section>


          <section className="workqueue-card">

            <div className="workqueue-card-header">

              <div>

                <span>
                  WF-01 / WF-03
                </span>

                <h2>
                  Operational Queues
                </h2>

              </div>

              <strong>
                {
                  filteredItems.length
                } items
              </strong>

            </div>


            <div className="workqueue-tabs">

              {queues.map(
                (queue) => (

                  <button
                    key={
                      queue
                    }
                    className={
                      selectedQueue ===
                      queue
                        ? "active"
                        : ""
                    }
                    onClick={() => {
                      setSelectedQueue(
                        queue
                      );
                      setView(
                        "All"
                      );
                    }}
                  >

                    <span>
                      {queue}
                    </span>

                    <small>
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
                    </small>

                  </button>

                )
              )}

            </div>

          </section>


          <section className="workqueue-card">

            <div className="workqueue-toolbar">

              <div className="workqueue-search">

                <span>
                  🔍
                </span>

                <input
                  value={
                    search
                  }
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search claim, customer, team or assignee"
                />

              </div>


              <select
                value={
                  priority
                }
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
                value={
                  status
                }
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

                <option value="Resolved">
                  Resolved
                </option>

              </select>


              <button
                className="workqueue-reset"
                onClick={() => {
                  setSearch("");
                  setPriority(
                    "All"
                  );
                  setStatus(
                    "All"
                  );
                  setSelectedQueue(
                    "All"
                  );
                  setView("All");
                }}
              >
                Reset
              </button>

            </div>


            <div className="workqueue-table-wrapper">

              {filteredItems.length ===
              0 ? (

                <div className="workqueue-empty">

                  <div>
                    📭
                  </div>

                  <h3>
                    No work items found
                  </h3>

                  <p>
                    No operational work
                    matches the selected
                    filters.
                  </p>

                  <button
                    className="operations-primary-button"
                    onClick={() => {
                      setSearch("");
                      setPriority(
                        "All"
                      );
                      setStatus(
                        "All"
                      );
                      setSelectedQueue(
                        "All"
                      );
                      setView("All");
                    }}
                  >
                    Clear Filters
                  </button>

                </div>

              ) : (

                <table className="workqueue-table">

                  <thead>

                    <tr>

                      <th>
                        Work Item
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
                        Assignee
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

                        const percentage =
                          Math.min(
                            (item.elapsedHours /
                              item.slaHours) *
                              100,
                            100
                          );

                        const isAging =
                          item.elapsedHours >=
                          item.slaHours;

                        const isWarning =
                          item.elapsedHours >=
                            item.slaHours *
                              0.75 &&
                          !isAging;

                        return (
                          <tr
                            key={
                              item.id
                            }
                            className={
                              isAging
                                ? "workqueue-aging-row"
                                : ""
                            }
                          >

                            <td>

                              <Link
                                to={`/workflow/${item.id}`}
                                className="workqueue-id"
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

                              <strong className="workqueue-customer">
                                {
                                  item.customer
                                }
                              </strong>

                            </td>


                            <td>

                              <span className="workqueue-team">
                                {
                                  item.team
                                }
                              </span>

                            </td>


                            <td>

                              <span
                                className={`workqueue-priority ${item.priority.toLowerCase()}`}
                              >
                                {
                                  item.priority
                                }
                              </span>

                            </td>


                            <td>

                              <span
                                className={
                                  item.assignedTo ===
                                  "Unassigned"
                                    ? "workqueue-unassigned"
                                    : "workqueue-assignee"
                                }
                              >
                                {
                                  item.assignedTo
                                }
                              </span>

                            </td>


                            <td>

                              <div className="workqueue-sla">

                                <div className="workqueue-sla-time">

                                  <strong
                                    className={
                                      isAging
                                        ? "danger"
                                        : isWarning
                                        ? "warning"
                                        : "normal"
                                    }
                                  >
                                    {Math.max(
                                      item.slaHours -
                                        item.elapsedHours,
                                      0
                                    )}
                                    h
                                  </strong>

                                  <span>
                                    /{" "}
                                    {
                                      item.slaHours
                                    }h
                                  </span>

                                </div>


                                <div className="workqueue-progress">

                                  <span
                                    style={{
                                      width: `${percentage}%`,
                                    }}
                                  />

                                </div>


                                <small>

                                  {isAging
                                    ? "SLA breached"
                                    : isWarning
                                    ? "SLA warning"
                                    : "Within SLA"}

                                </small>

                              </div>

                            </td>


                            <td>

                              <span className="workqueue-status">
                                {
                                  item.status
                                }
                              </span>

                              {item.escalation && (

                                <span className="workqueue-escalation">
                                  Escalated
                                </span>

                              )}

                            </td>


                            <td>

                              <button
                                className="workqueue-open-button"
                                onClick={() =>
                                  navigate(
                                    `/workflow/${item.id}`
                                  )
                                }
                              >
                                Open
                              </button>

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


          <section className="workqueue-info-grid">

            <div className="workqueue-info-card">

              <span>
                TEAM QUEUES
              </span>

              <h3>
                Work by Team
              </h3>

              {queues
                .filter(
                  (queue) =>
                    queue !==
                    "All"
                )
                .map(
                  (queue) => {

                    const count =
                      workItems.filter(
                        (item) =>
                          item.team ===
                          queue
                      ).length;

                    return (
                      <div
                        className="workqueue-team-row"
                        key={
                          queue
                        }
                      >

                        <span>
                          {
                            queue
                          }
                        </span>

                        <strong>
                          {
                            count
                          }
                        </strong>

                      </div>
                    );
                  }
                )}

            </div>


            <div className="workqueue-info-card">

              <span>
                QUEUE HEALTH
              </span>

              <h3>
                Current Status
              </h3>


              <div className="workqueue-health">

                <div>
                  <span>
                    Within SLA
                  </span>

                  <strong>
                    {
                      workItems.filter(
                        (item) =>
                          item.elapsedHours <
                          item.slaHours *
                            0.75
                      ).length
                    }
                  </strong>
                </div>


                <div>
                  <span>
                    Warning
                  </span>

                  <strong>
                    {
                      slaWarning
                    }
                  </strong>
                </div>


                <div>
                  <span>
                    Breached
                  </span>

                  <strong>
                    {
                      aging
                    }
                  </strong>
                </div>

              </div>

            </div>

          </section>

        </div>

      </main>

      <Footer />
    </>
  );
}

function QueueStat({
  label,
  value,
  active,
  onClick,
}) {
  return (
    <button
      className={
        active
          ? "workqueue-stat active"
          : "workqueue-stat"
      }
      onClick={
        onClick
      }
    >

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </button>
  );
}

export default WorkQueue;