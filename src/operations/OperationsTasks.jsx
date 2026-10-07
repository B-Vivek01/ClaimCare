import { useClaims } from "../claim/ClaimContext";
import {
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function OperationsTasks() {
  const {claims}=useClaims();
  const tasks=claims.flatMap(claim=>(claim.tasks || []).map(task=>({...task,claim:claim.id,assignee:task.assignee || claim.assignedSpecialist || "Unassigned",due:task.dueDate || "Not set",type:task.type || "Claim Task"})));

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
