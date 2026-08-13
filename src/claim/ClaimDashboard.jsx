import { useMemo, useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useClaims } from "./ClaimContext";

function ClaimDashboard() {
  const navigate = useNavigate();

  const {
    claims,
  } = useClaims();

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [showArchived, setShowArchived] =
    useState(false);

  const visibleClaims = useMemo(() => {
    return claims.filter((claim) => {
      if (
        !showArchived &&
        claim.archived
      ) {
        return false;
      }

      const text =
        `${claim.claimNumber}
        ${claim.policyNumber}
        ${claim.customerName}
        ${claim.category}
        ${claim.template}`
          .toLowerCase();

      const matchesSearch =
        text.includes(
          search.toLowerCase()
        );

      const matchesStatus =
        statusFilter === "All" ||
        claim.status ===
          statusFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        claim.category ===
          categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    claims,
    search,
    statusFilter,
    categoryFilter,
    showArchived,
  ]);

  const activeClaims =
    claims.filter(
      (claim) =>
        !claim.archived &&
        claim.status !==
          "Closed"
    );

  const draftClaims =
    claims.filter(
      (claim) =>
        claim.status ===
        "Draft"
    );

  const closedClaims =
    claims.filter(
      (claim) =>
        claim.status ===
        "Closed"
    );

  return (
    <>

      <main className="claim-dashboard-page">

        <div className="claim-container">

          {/* HEADER */}

          <div className="claim-header">

            <div>

              <span className="claim-badge">
                CLAIM MANAGEMENT
              </span>

              <h1>
                Claims
              </h1>

              <p>
                Create, track and manage your
                insurance claims.
              </p>

            </div>

            <button
              className="claim-primary-button"
              onClick={() =>
                navigate(
                  "/claims/new"
                )
              }
            >
              + Start New Claim
            </button>

          </div>


          {/* STATISTICS */}

          <div className="claim-stat-grid">

            <StatCard
              label="Active Claims"
              value={
                activeClaims.length
              }
            />

            <StatCard
              label="Draft Claims"
              value={
                draftClaims.length
              }
            />

            <StatCard
              label="Closed Claims"
              value={
                closedClaims.length
              }
            />

            <StatCard
              label="Total Claims"
              value={
                claims.length
              }
            />

          </div>


          {/* DRAFTS */}

          {draftClaims.length > 0 && (

            <section className="claim-draft-card">

              <div>

                <strong>
                  You have saved claim drafts
                </strong>

                <p>
                  Continue your incomplete claim
                  submission.
                </p>

              </div>

              <div>

                {draftClaims.map(
                  (claim) => (

                    <Link
                      key={claim.id}
                      to={`/claims/new?draft=${claim.id}`}
                      className="claim-draft-link"
                    >
                      Resume{" "}
                      {claim.claimNumber}
                    </Link>

                  )
                )}

              </div>

            </section>

          )}


          {/* LIST */}

          <section className="claim-list-card">

            <div className="claim-toolbar">

              <div className="claim-search">

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
                  placeholder="Search claim number, policy, category..."
                />

              </div>


              <select
                value={
                  categoryFilter
                }
                onChange={(event) =>
                  setCategoryFilter(
                    event.target.value
                  )
                }
              >

                <option value="All">
                  All Categories
                </option>

                <option value="Health">
                  Health
                </option>

                <option value="Motor">
                  Motor
                </option>

                <option value="Property">
                  Property
                </option>

                <option value="Travel">
                  Travel
                </option>

                <option value="Other">
                  Other
                </option>

              </select>


              <select
                value={
                  statusFilter
                }
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >

                <option value="All">
                  All Status
                </option>

                <option value="Draft">
                  Draft
                </option>

                <option value="Submitted">
                  Submitted
                </option>

                <option value="Under Review">
                  Under Review
                </option>

                <option value="Pending Customer">
                  Pending Customer
                </option>

                <option value="Closed">
                  Closed
                </option>

                <option value="Archived">
                  Archived
                </option>

              </select>

              <label className="claim-archive-toggle">

                <input
                  type="checkbox"
                  checked={
                    showArchived
                  }
                  onChange={(event) =>
                    setShowArchived(
                      event.target.checked
                    )
                  }
                />

                Show archived

              </label>

            </div>


            {visibleClaims.length ===
            0 ? (

              <div className="claim-empty">

                <strong>
                  No claims found
                </strong>

                <p>
                  Try another search or filter,
                  or start a new claim.
                </p>

                <button
                  className="claim-primary-button"
                  onClick={() =>
                    navigate(
                      "/claims/new"
                    )
                  }
                >
                  Start New Claim
                </button>

              </div>

            ) : (

              <div className="claim-table-wrapper">

                <table className="claim-table">

                  <thead>

                    <tr>

                      <th>
                        Claim
                      </th>

                      <th>
                        Policy
                      </th>

                      <th>
                        Category
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Priority
                      </th>

                      <th>
                        Progress
                      </th>

                      <th>
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {visibleClaims.map(
                      (claim) => (

                        <tr
                          key={claim.id}
                        >

                          <td>

                            <Link
                              to={`/claims/${claim.id}`}
                              className="claim-number-link"
                            >
                              {
                                claim.claimNumber
                              }
                            </Link>

                            <small>
                              {
                                claim.customerName
                              }
                            </small>

                          </td>

                          <td>
                            {
                              claim.policyNumber
                            }
                          </td>

                          <td>

                            <span className="claim-category">
                              {
                                claim.category
                              }
                            </span>

                          </td>

                          <td>

                            <span
                              className={`claim-status ${getStatusClass(
                                claim.status
                              )}`}
                            >
                              {
                                claim.status
                              }
                            </span>

                          </td>

                          <td>

                            <span
                              className={`claim-priority ${claim.priority.toLowerCase()}`}
                            >
                              {
                                claim.priority
                              }
                            </span>

                          </td>

                          <td>

                            <div className="claim-progress">

                              <div>

                                <span
                                  style={{
                                    width: `${claim.progress}%`,
                                  }}
                                />

                              </div>

                              <small>
                                {
                                  claim.progress
                                }%
                              </small>

                            </div>

                          </td>

                          <td>

                            <Link
                              to={`/claims/${claim.id}`}
                              className="claim-action-link"
                            >
                              View
                            </Link>

                            {claim.status ===
                              "Draft" && (

                              <Link
                                to={`/claims/new?draft=${claim.id}`}
                                className="claim-action-link"
                              >
                                Resume
                              </Link>

                            )}

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>


          {/* FUTURE FEATURES */}

          <section className="claim-future-card">

            <div>

              <strong>
                Advanced Claim Operations
              </strong>

              <p>
                Claim merge and split workflows
                are planned for a future release.
              </p>

            </div>

            <div>

              <button
                className="claim-disabled-button"
                disabled
              >
                Merge Claims
              </button>

              <button
                className="claim-disabled-button"
                disabled
              >
                Split Claim
              </button>

            </div>

          </section>

        </div>

      </main>

      <Footer />
    </>
  );
}

function StatCard({
  label,
  value,
}) {
  return (
    <div className="claim-stat-card">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}

function getStatusClass(status) {
  return status
    .toLowerCase()
    .replaceAll(" ", "-");
}

export default ClaimDashboard;