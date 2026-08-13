import {
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const initialTasks = [
  {
    id: "TSK-1001",
    title: "Verify Hospital Documents",
    claim: "CLM-1001",
    assignee: "Arjun",
    priority: "High",
    status: "Pending",
    due: "11 Aug 2026",
    type: "Document Review",
  },
  {
    id: "TSK-1002",
    title: "Review Vehicle Estimate",
    claim: "CLM-1002",
    assignee: "Meena",
    priority: "Medium",
    status: "In Progress",
    due: "12 Aug 2026",
    type: "Assessment",
  },
  {
    id: "TSK-1003",
    title: "Request Missing Invoice",
    claim: "CLM-1003",
    assignee: "Unassigned",
    priority: "High",
    status: "Pending",
    due: "10 Aug 2026",
    type: "Customer Action",
  },
  {
    id: "TSK-1004",
    title: "Review Property Inspection",
    claim: "CLM-1004",
    assignee: "Kiran",
    priority: "Low",
    status: "Completed",
    due: "08 Aug 2026",
    type: "Assessment",
  },
];

function OperationsTasks() {
  const [tasks] =
    useState(initialTasks);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const filteredTasks =
    useMemo(() => {
      return tasks.filter(
        (task) => {
          const text =
            `${task.id}
            ${task.title}
            ${task.claim}
            ${task.assignee}
            ${task.type}`
              .toLowerCase();

          return (
            text.includes(
              search.toLowerCase()
            ) &&
            (
              status === "All" ||
              task.status ===
                status
            )
          );
        }
      );
    }, [
      tasks,
      search,
      status,
    ]);

  return (
    <>
      <Navbar />

      <main className="operations-page">
        <div className="operations-container">

          <div className="operations-header">

            <div>
              <span className="operations-badge">
                OPS-03 · TASKS
              </span>

              <h1>
                Operations Tasks
              </h1>

              <p>
                Track operational tasks,
                assignments and completion status.
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
              label="Total Tasks"
              value={tasks.length}
            />

            <Stat
              label="Pending"
              value={
                tasks.filter(
                  (task) =>
                    task.status ===
                    "Pending"
                ).length
              }
            />

            <Stat
              label="In Progress"
              value={
                tasks.filter(
                  (task) =>
                    task.status ===
                    "In Progress"
                ).length
              }
            />

            <Stat
              label="Completed"
              value={
                tasks.filter(
                  (task) =>
                    task.status ===
                    "Completed"
                ).length
              }
            />

            <Stat
              label="Unassigned"
              value={
                tasks.filter(
                  (task) =>
                    task.assignee ===
                    "Unassigned"
                ).length
              }
            />

          </div>


          <section className="workqueue-card">

            <div className="workqueue-card-header">

              <div>
                <span>
                  TASK MANAGEMENT
                </span>

                <h2>
                  Operational Tasks
                </h2>
              </div>

              <strong>
                {filteredTasks.length} tasks
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
                  placeholder="Search tasks..."
                />

              </div>


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

                <option value="Pending">
                  Pending
                </option>

                <option value="In Progress">
                  In Progress
                </option>

                <option value="Completed">
                  Completed
                </option>
              </select>

            </div>


            <div className="workqueue-table-wrapper">

              <table className="workqueue-table">

                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Claim</th>
                    <th>Type</th>
                    <th>Assignee</th>
                    <th>Priority</th>
                    <th>Due</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredTasks.map(
                    (task) => (
                      <tr
                        key={task.id}
                      >

                        <td>
                          <strong>
                            {task.title}
                          </strong>

                          <small>
                            {task.id}
                          </small>
                        </td>

                        <td>
                          {task.claim}
                        </td>

                        <td>
                          {task.type}
                        </td>

                        <td>
                          {task.assignee}
                        </td>

                        <td>
                          <span
                            className={`workqueue-priority ${task.priority.toLowerCase()}`}
                          >
                            {task.priority}
                          </span>
                        </td>

                        <td>
                          {task.due}
                        </td>

                        <td>
                          <span className="workqueue-status">
                            {task.status}
                          </span>
                        </td>

                        <td>
                          <button className="workqueue-open-button">
                            Open
                          </button>
                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

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

export default OperationsTasks;