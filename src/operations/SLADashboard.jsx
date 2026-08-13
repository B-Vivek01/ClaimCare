import {
  useMemo,
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const initialSLAItems = [
  {
    id: "CLM-1001",
    customer: "Rahul Kumar",
    type: "Medical Claim",
    team: "Medical Claims",
    elapsed: 18,
    sla: 24,
    status: "Warning",
    escalated: false,
  },
  {
    id: "CLM-1002",
    customer: "Priya Sharma",
    type: "Vehicle Claim",
    team: "Motor Claims",
    elapsed: 20,
    sla: 48,
    status: "Within SLA",
    escalated: false,
  },
  {
    id: "CLM-1003",
    customer: "Anil Kumar",
    type: "Medical Claim",
    team: "Medical Claims",
    elapsed: 26,
    sla: 24,
    status: "Breached",
    escalated: true,
  },
  {
    id: "CLM-1004",
    customer: "Sneha Reddy",
    type: "Property Claim",
    team: "Property Claims",
    elapsed: 32,
    sla: 72,
    status: "Within SLA",
    escalated: false,
  },
];

function SLADashboard() {
  const [items] =
    useState(initialSLAItems);

  const [filter, setFilter] =
    useState("All");

  const filteredItems =
    useMemo(() => {
      return items.filter(
        (item) =>
          filter === "All" ||
          item.status ===
            filter
      );
    }, [
      items,
      filter,
    ]);

  const within =
    items.filter(
      (item) =>
        item.status ===
        "Within SLA"
    ).length;

  const warning =
    items.filter(
      (item) =>
        item.status ===
        "Warning"
    ).length;

  const breached =
    items.filter(
      (item) =>
        item.status ===
        "Breached"
    ).length;

  const escalated =
    items.filter(
      (item) =>
        item.escalated
    ).length;

  return (
    <>
      <Navbar />

      <main className="operations-page">
        <div className="operations-container">

          <div className="operations-header">

            <div>
              <span className="operations-badge">
                OPS-07 · SLA
              </span>

              <h1>
                SLA Dashboard
              </h1>

              <p>
                Monitor remaining SLA time,
                warnings, breaches and escalations.
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
              label="Within SLA"
              value={within}
            />

            <Stat
              label="Warnings"
              value={warning}
            />

            <Stat
              label="Breached"
              value={breached}
            />

            <Stat
              label="Escalated"
              value={escalated}
            />

            <Stat
              label="Total"
              value={items.length}
            />

          </div>


          <section className="workqueue-card">

            <div className="workqueue-card-header">

              <div>
                <span>
                  WF-06 / WF-07 / WF-08
                </span>

                <h2>
                  SLA Monitoring
                </h2>
              </div>

              <select
                value={filter}
                onChange={(event) =>
                  setFilter(
                    event.target.value
                  )
                }
              >
                <option value="All">
                  All
                </option>

                <option value="Within SLA">
                  Within SLA
                </option>

                <option value="Warning">
                  Warning
                </option>

                <option value="Breached">
                  Breached
                </option>
              </select>

            </div>


            <div className="workqueue-table-wrapper">

              <table className="workqueue-table">

                <thead>
                  <tr>
                    <th>Work Item</th>
                    <th>Customer</th>
                    <th>Team</th>
                    <th>SLA</th>
                    <th>Progress</th>
                    <th>Status</th>
                    <th>Escalation</th>
                  </tr>
                </thead>

                <tbody>

                  {filteredItems.map(
                    (item) => {

                      const percentage =
                        Math.min(
                          (item.elapsed /
                            item.sla) *
                            100,
                          100
                        );

                      const remaining =
                        Math.max(
                          item.sla -
                            item.elapsed,
                          0
                        );

                      return (
                        <tr
                          key={
                            item.id
                          }
                        >

                          <td>
                            <strong>
                              {item.id}
                            </strong>

                            <small>
                              {item.type}
                            </small>
                          </td>

                          <td>
                            {item.customer}
                          </td>

                          <td>
                            {item.team}
                          </td>

                          <td>
                            <strong
                              className={
                                item.status ===
                                "Breached"
                                  ? "danger"
                                  : item.status ===
                                    "Warning"
                                  ? "warning"
                                  : "normal"
                              }
                            >
                              {remaining}h
                            </strong>

                            <small>
                              of{" "}
                              {item.sla}h
                            </small>
                          </td>

                          <td>

                            <div className="workqueue-sla">

                              <div className="workqueue-progress">
                                <span
                                  style={{
                                    width: `${percentage}%`,
                                  }}
                                />
                              </div>

                              <small>
                                {Math.round(
                                  percentage
                                )}
                                %
                              </small>

                            </div>

                          </td>

                          <td>
                            <span className="workqueue-status">
                              {item.status}
                            </span>
                          </td>

                          <td>
                            {item.escalated ? (
                              <span className="workqueue-escalation">
                                Escalated
                              </span>
                            ) : (
                              <span>
                                —
                              </span>
                            )}
                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          </section>


          <section className="workqueue-info-grid">

            <div className="workqueue-info-card">

              <span>
                SLA SUMMARY
              </span>

              <h3>
                Compliance
              </h3>

              <div className="sla-compliance">

                <strong>
                  {Math.round(
                    (within /
                      items.length) *
                      100
                  )}
                  %
                </strong>

                <span>
                  Current items within SLA
                </span>

              </div>

            </div>


            <div className="workqueue-info-card">

              <span>
                ESCALATION
              </span>

              <h3>
                Manager Attention
              </h3>

              <div className="sla-compliance">

                <strong>
                  {escalated}
                </strong>

                <span>
                  Items requiring escalation attention
                </span>

              </div>

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

export default SLADashboard;