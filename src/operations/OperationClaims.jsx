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

const initialClaims = [
  {
    id: "CLM-1001",
    customer: "Rahul Kumar",
    type: "Medical Claim",
    policy: "POL-2026-1001",
    amount: "₹85,000",
    status: "In Progress",
    priority: "High",
    assignee: "Arjun",
    updated: "10 Aug 2026",
  },
  {
    id: "CLM-1002",
    customer: "Priya Sharma",
    type: "Vehicle Claim",
    policy: "POL-2026-1002",
    amount: "₹42,500",
    status: "New",
    priority: "Medium",
    assignee: "Unassigned",
    updated: "10 Aug 2026",
  },
  {
    id: "CLM-1003",
    customer: "Anil Kumar",
    type: "Medical Claim",
    policy: "POL-2026-1003",
    amount: "₹1,20,000",
    status: "Pending Documents",
    priority: "High",
    assignee: "Meena",
    updated: "09 Aug 2026",
  },
  {
    id: "CLM-1004",
    customer: "Sneha Reddy",
    type: "Property Claim",
    policy: "POL-2026-1004",
    amount: "₹2,40,000",
    status: "In Progress",
    priority: "Low",
    assignee: "Arjun",
    updated: "08 Aug 2026",
  },
  {
    id: "CLM-1005",
    customer: "Vikram Singh",
    type: "Vehicle Claim",
    policy: "POL-2026-1005",
    amount: "₹65,000",
    status: "Resolved",
    priority: "Medium",
    assignee: "Kiran",
    updated: "07 Aug 2026",
  },
];

function OperationsClaims() {
  const navigate = useNavigate();

  const [claims] =
    useState(initialClaims);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("All");

  const [priority, setPriority] =
    useState("All");

  const filteredClaims =
    useMemo(() => {
      return claims.filter(
        (claim) => {
          const searchText =
            `${claim.id}
            ${claim.customer}
            ${claim.type}
            ${claim.policy}
            ${claim.assignee}`
              .toLowerCase();

          const matchesSearch =
            searchText.includes(
              search.toLowerCase()
            );

          const matchesStatus =
            status === "All" ||
            claim.status ===
              status;

          const matchesPriority =
            priority === "All" ||
            claim.priority ===
              priority;

          return (
            matchesSearch &&
            matchesStatus &&
            matchesPriority
          );
        }
      );
    }, [
      claims,
      search,
      status,
      priority,
    ]);

  const activeClaims =
    claims.filter(
      (claim) =>
        claim.status !==
        "Resolved"
    ).length;

  const newClaims =
    claims.filter(
      (claim) =>
        claim.status ===
        "New"
    ).length;

  const pendingClaims =
    claims.filter(
      (claim) =>
        claim.status ===
        "Pending Documents"
    ).length;

  const highPriority =
    claims.filter(
      (claim) =>
        claim.priority ===
        "High"
    ).length;

  return (
    <>
      <Navbar />

      <main className="operations-page">
        <div className="operations-container">

          <div className="operations-header">

            <div>
              <span className="operations-badge">
                OPS-02 · CLAIMS
              </span>

              <h1>
                Operations Claims
              </h1>

              <p>
                Review and manage claims
                from the operations workspace.
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
              label="Active Claims"
              value={activeClaims}
            />

            <Stat
              label="New Claims"
              value={newClaims}
            />

            <Stat
              label="Pending Documents"
              value={pendingClaims}
            />

            <Stat
              label="High Priority"
              value={highPriority}
            />

            <Stat
              label="Total Claims"
              value={claims.length}
            />

          </div>


          <section className="workqueue-card">

            <div className="workqueue-card-header">

              <div>
                <span>
                  CLAIM OPERATIONS
                </span>

                <h2>
                  Claims Register
                </h2>
              </div>

              <strong>
                {filteredClaims.length} claims
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
                  placeholder="Search claim, customer, policy..."
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

            </div>


            <div className="workqueue-table-wrapper">

              <table className="workqueue-table">

                <thead>
                  <tr>
                    <th>Claim</th>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Policy</th>
                    <th>Amount</th>
                    <th>Priority</th>
                    <th>Assignee</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>


                <tbody>

                  {filteredClaims.map(
                    (claim) => (
                      <tr
                        key={claim.id}
                      >

                        <td>
                          <strong>
                            {claim.id}
                          </strong>

                          <small>
                            Updated{" "}
                            {claim.updated}
                          </small>
                        </td>

                        <td>
                          {claim.customer}
                        </td>

                        <td>
                          {claim.type}
                        </td>

                        <td>
                          {claim.policy}
                        </td>

                        <td>
                          {claim.amount}
                        </td>

                        <td>
                          <span
                            className={`workqueue-priority ${claim.priority.toLowerCase()}`}
                          >
                            {claim.priority}
                          </span>
                        </td>

                        <td>
                          {claim.assignee}
                        </td>

                        <td>
                          <span className="workqueue-status">
                            {claim.status}
                          </span>
                        </td>

                        <td>
                          <button
                            className="workqueue-open-button"
                            onClick={() =>
                              navigate(
                                `/claims/${claim.id}`
                              )
                            }
                          >
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

export default OperationsClaims;