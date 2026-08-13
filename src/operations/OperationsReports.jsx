import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function OperationsReports() {
  const [period, setPeriod] =
    useState("This Month");

  const reports = [
    {
      name: "Claims Operations Report",
      description:
        "Claim volume, status and operational performance.",
      value: "128",
      label: "Claims Processed",
    },
    {
      name: "Queue Performance Report",
      description:
        "Queue workload, assignment and aging information.",
      value: "92%",
      label: "Queue Efficiency",
    },
    {
      name: "SLA Performance Report",
      description:
        "SLA compliance and breached work items.",
      value: "94%",
      label: "SLA Compliance",
    },
    {
      name: "Task Completion Report",
      description:
        "Operational task completion and pending workload.",
      value: "87%",
      label: "Completion Rate",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="operations-page">
        <div className="operations-container">

          <div className="operations-header">

            <div>
              <span className="operations-badge">
                OPS-06 · REPORTS
              </span>

              <h1>
                Operations Reports
              </h1>

              <p>
                Review operational performance,
                workload and SLA reporting.
              </p>
            </div>

            <Link
              to="/ops"
              className="operations-secondary-button"
            >
              ← Operations Portal
            </Link>

          </div>


          <section className="workqueue-card">

            <div className="workqueue-card-header">

              <div>
                <span>
                  REPORTING
                </span>

                <h2>
                  Reporting Period
                </h2>
              </div>

              <select
                value={period}
                onChange={(event) =>
                  setPeriod(
                    event.target.value
                  )
                }
                className="reports-period"
              >
                <option>
                  Today
                </option>

                <option>
                  This Week
                </option>

                <option>
                  This Month
                </option>

                <option>
                  This Quarter
                </option>
              </select>

            </div>

          </section>


          <section className="operations-module-grid">

            {reports.map(
              (report) => (

                <article
                  key={
                    report.name
                  }
                  className="operations-module-card"
                >

                  <div className="operations-module-icon">
                    📊
                  </div>

                  <div className="operations-module-content">

                    <span>
                      REPORT
                    </span>

                    <h3>
                      {
                        report.name
                      }
                    </h3>

                    <p>
                      {
                        report.description
                      }
                    </p>

                    <strong className="report-value">
                      {
                        report.value
                      }
                    </strong>

                    <small className="report-value-label">
                      {
                        report.label
                      }
                    </small>

                  </div>

                </article>

              )
            )}

          </section>


          <section className="workqueue-card">

            <div className="workqueue-card-header">

              <div>
                <span>
                  OPERATIONAL SUMMARY
                </span>

                <h2>
                  Current Performance
                </h2>
              </div>

            </div>


            <div className="report-bars">

              <ReportBar
                label="Claims Processing"
                value={82}
              />

              <ReportBar
                label="Assignment Efficiency"
                value={91}
              />

              <ReportBar
                label="Document Review"
                value={76}
              />

              <ReportBar
                label="Task Completion"
                value={87}
              />

              <ReportBar
                label="SLA Compliance"
                value={94}
              />

            </div>

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

function ReportBar({
  label,
  value,
}) {
  return (
    <div className="report-bar">

      <div>
        <span>
          {label}
        </span>

        <strong>
          {value}%
        </strong>
      </div>

      <div className="report-bar-track">
        <span
          style={{
            width: `${value}%`,
          }}
        />
      </div>

    </div>
  );
}

export default OperationsReports;