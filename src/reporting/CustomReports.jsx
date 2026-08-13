import { useState } from "react";
import { Link } from "react-router-dom";

import {
  useReporting,
} from "./ReportingContext";

function CustomReports() {
  const {
    addReport,
    reports,
  } = useReporting();

  const [form, setForm] =
    useState({
      name: "",
      category: "Claims",
      type: "Custom",
    });

  const [message, setMessage] =
    useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      setMessage(
        "Enter a report name."
      );

      return;
    }

    addReport({
      name: form.name,
      category: form.category,
      type: form.type,
      totalClaims: 0,
      completed: 0,
      pending: 0,
      escalated: 0,
      slaCompliance: 0,
    });

    setMessage(
      "Custom report created successfully."
    );

    setForm({
      name: "",
      category: "Claims",
      type: "Custom",
    });
  };

  return (
    <main className="reporting-page">
      <div className="reporting-container">

        <div className="reporting-header">

          <div>
            <span className="reporting-badge">
              RPT-15
            </span>

            <h1>
              Custom Reports
            </h1>

            <p>
              Configure reports based on
              authorized reporting needs.
            </p>
          </div>

          <Link
            to="/reports"
            className="reporting-secondary-button"
          >
            ← Reports
          </Link>

        </div>

        <section className="reporting-card">

          <div className="reporting-card-header">

            <div>
              <span>
                REPORT CONFIGURATION
              </span>

              <h2>
                Create Custom Report
              </h2>
            </div>

          </div>

          {message && (
            <div className="reporting-success">
              {message}
            </div>
          )}

          <form
            className="reporting-form"
            onSubmit={handleSubmit}
          >

            <label>
              Report Name

              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name:
                      e.target.value,
                  })
                }
                placeholder="Enter report name"
              />
            </label>

            <label>
              Category

              <select
                value={form.category}
                onChange={(e) =>
                  setForm({
                    ...form,
                    category:
                      e.target.value,
                  })
                }
              >
                <option>
                  Claims
                </option>

                <option>
                  Operations
                </option>

                <option>
                  Finance
                </option>

                <option>
                  Customers
                </option>

                <option>
                  SLA
                </option>
              </select>
            </label>

            <button
              type="submit"
              className="reporting-primary-button"
            >
              Create Report
            </button>

          </form>

        </section>

        <section className="reporting-card">

          <div className="reporting-card-header">

            <div>
              <span>
                CONFIGURED REPORTS
              </span>

              <h2>
                Available Reports
              </h2>
            </div>

          </div>

          <div className="reporting-export-list">

            {reports.map(
              (report) => (
                <div
                  className="reporting-export-item"
                  key={report.id}
                >
                  <div>
                    <strong>
                      {report.name}
                    </strong>

                    <small>
                      {report.category} ·{" "}
                      {report.type}
                    </small>
                  </div>

                  <span className="reporting-status">
                    {report.id}
                  </span>
                </div>
              )
            )}

          </div>

        </section>

      </div>
    </main>
  );
}

export default CustomReports;