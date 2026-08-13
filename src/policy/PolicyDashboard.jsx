import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { usePolicies } from "./PolicyContext";

function PolicyDashboard() {
  const navigate = useNavigate();

  const {
    policies,
    archivePolicy,
    restorePolicy,
  } = usePolicies();

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [archiveId, setArchiveId] =
    useState(null);

  const filteredPolicies = useMemo(() => {
    return policies.filter((policy) => {
      const searchText =
        `${policy.policyNumber}
        ${policy.policyHolderName}
        ${policy.provider}
        ${policy.policyType}`
          .toLowerCase();

      const matchesSearch =
        searchText.includes(
          search.toLowerCase()
        );

      const matchesStatus =
        statusFilter === "All" ||
        policy.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        policy.category === categoryFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    policies,
    search,
    statusFilter,
    categoryFilter,
  ]);

  const activePolicies = policies.filter(
    (policy) => policy.status === "Active"
  );

  const archivedPolicies = policies.filter(
    (policy) => policy.status === "Archived"
  );

  const totalCoverage = activePolicies.reduce(
    (total, policy) =>
      total + Number(policy.coverageAmount || 0),
    0
  );

  const handleArchive = () => {
    if (!archiveId) {
      return;
    }

    archivePolicy(archiveId);
    setArchiveId(null);
  };

  return (
    <>

      <main className="policy-dashboard-page">

        <div className="policy-dashboard-container">

          {/* HEADER */}

          <div className="policy-dashboard-header">

            <div>

              <span className="policy-badge">
                POLICY MANAGEMENT
              </span>

              <h1>
                Policies
              </h1>

              <p>
                View, search and manage your insurance
                policies.
              </p>

            </div>

            <button
              className="policy-primary-button"
              onClick={() =>
                navigate("/policies/new")
              }
            >
              + Add Policy
            </button>

          </div>


          {/* SUMMARY */}

          <div className="policy-stat-grid">

            <div className="policy-stat-card">

              <span>
                Active Policies
              </span>

              <strong>
                {activePolicies.length}
              </strong>

            </div>

            <div className="policy-stat-card">

              <span>
                Archived Policies
              </span>

              <strong>
                {archivedPolicies.length}
              </strong>

            </div>

            <div className="policy-stat-card">

              <span>
                Total Policies
              </span>

              <strong>
                {policies.length}
              </strong>

            </div>

            <div className="policy-stat-card">

              <span>
                Active Coverage
              </span>

              <strong>
                ₹
                {totalCoverage.toLocaleString(
                  "en-IN"
                )}
              </strong>

            </div>

          </div>


          {/* SEARCH / FILTER */}

          <section className="policy-list-card">

            <div className="policy-list-toolbar">

              <div className="policy-search">

                <span>
                  🔍
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search policy number, provider, holder..."
                />

              </div>


              <select
                value={categoryFilter}
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

                <option value="Life">
                  Life
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
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(
                    event.target.value
                  )
                }
              >

                <option value="All">
                  All Status
                </option>

                <option value="Active">
                  Active
                </option>

                <option value="Pending">
                  Pending
                </option>

                <option value="Inactive">
                  Inactive
                </option>

                <option value="Archived">
                  Archived
                </option>

              </select>

            </div>


            {/* LIST */}

            {filteredPolicies.length === 0 ? (

              <div className="policy-empty">

                <strong>
                  No policies found
                </strong>

                <p>
                  Try changing your search or
                  filter criteria.
                </p>

              </div>

            ) : (

              <div className="policy-table-wrapper">

                <table className="policy-table">

                  <thead>

                    <tr>

                      <th>
                        Policy
                      </th>

                      <th>
                        Type
                      </th>

                      <th>
                        Provider
                      </th>

                      <th>
                        Category
                      </th>

                      <th>
                        Status
                      </th>

                      <th>
                        Renewal
                      </th>

                      <th>
                        Actions
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {filteredPolicies.map(
                      (policy) => (

                        <tr key={policy.id}>

                          <td>

                            <Link
                              to={`/policies/${policy.id}`}
                              className="policy-number-link"
                            >
                              {policy.policyNumber}
                            </Link>

                            <small>
                              {
                                policy.policyHolderName
                              }
                            </small>

                          </td>

                          <td>
                            {policy.policyType}
                          </td>

                          <td>
                            {policy.provider}
                          </td>

                          <td>

                            <span className="policy-category-badge">
                              {policy.category}
                            </span>

                          </td>

                          <td>

                            <span
                              className={`policy-status-badge ${policy.status
                                .toLowerCase()
                                .replace(
                                  " ",
                                  "-"
                                )}`}
                            >
                              {policy.status}
                            </span>

                          </td>

                          <td>

                            {policy.status ===
                            "Active" ? (

                              <Link
                                to={`/policies/${policy.id}/reminder`}
                                className="policy-renewal-link"
                              >
                                {policy.endDate}
                              </Link>

                            ) : (
                              "—"
                            )}

                          </td>

                          <td>

                            <div className="policy-row-actions">

                              <Link
                                to={`/policies/${policy.id}`}
                                className="policy-action-link"
                              >
                                View
                              </Link>

                              <Link
                                to={`/policies/${policy.id}/edit`}
                                className="policy-action-link"
                              >
                                Edit
                              </Link>

                              {policy.status ===
                              "Archived" ? (

                                <button
                                  className="policy-restore-button"
                                  onClick={() =>
                                    restorePolicy(
                                      policy.id
                                    )
                                  }
                                >
                                  Restore
                                </button>

                              ) : (

                                <button
                                  className="policy-archive-button"
                                  onClick={() =>
                                    setArchiveId(
                                      policy.id
                                    )
                                  }
                                >
                                  Archive
                                </button>

                              )}

                            </div>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            )}

          </section>

        </div>

      </main>


      {/* ARCHIVE CONFIRMATION */}

      {archiveId && (

        <div className="policy-modal-overlay">

          <div className="policy-modal">

            <h2>
              Archive Policy?
            </h2>

            <p>
              Are you sure you want to archive this
              policy? It will be removed from active
              policy views.
            </p>

            <div className="policy-modal-actions">

              <button
                className="policy-reset-button"
                onClick={() =>
                  setArchiveId(null)
                }
              >
                Cancel
              </button>

              <button
                className="policy-danger-button"
                onClick={handleArchive}
              >
                Archive Policy
              </button>

            </div>

          </div>

        </div>

      )}

      <Footer />
    </>
  );
}

export default PolicyDashboard;