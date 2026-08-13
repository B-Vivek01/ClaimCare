import { Link } from "react-router-dom";

import {
  useReporting,
} from "./ReportingContext";

function ExecutiveDashboard() {
  const {
    metrics,
  } = useReporting();

  return (
    <main className="reporting-page">
      <div className="reporting-container">

        <div className="reporting-header">

          <div>
            <span className="reporting-badge">
              RPT-06
            </span>

            <h1>
              Executive Dashboard
            </h1>

            <p>
              High-level business KPIs and
              performance trends.
            </p>
          </div>

          <Link
            to="/reports"
            className="reporting-secondary-button"
          >
            ← Reports
          </Link>

        </div>

        <section className="reporting-kpi-grid">

          <Kpi
            label="CLAIMS"
            value={metrics.totalClaims}
          />

          <Kpi
            label="COMPLETED"
            value={metrics.completedClaims}
          />

          <Kpi
            label="SLA"
            value={`${metrics.slaCompliance}%`}
          />

          <Kpi
            label="PRODUCTIVITY"
            value={`${metrics.productivity}%`}
          />

          <Kpi
            label="REVENUE"
            value={`₹${(
              metrics.revenue / 100000
            ).toFixed(1)}L`}
          />

          <Kpi
            label="SATISFACTION"
            value={`${metrics.customerSatisfaction}%`}
          />

        </section>

        <section className="reporting-card">

          <div className="reporting-card-header">

            <div>
              <span>
                BUSINESS OVERVIEW
              </span>

              <h2>
                Executive Summary
              </h2>
            </div>

          </div>

          <div className="reporting-summary-grid">

            <Summary
              title="Claims"
              value={`${metrics.completedClaims} completed`}
              text="Claims successfully completed."
            />

            <Summary
              title="SLA"
              value={`${metrics.slaCompliance}%`}
              text="Current SLA compliance."
            />

            <Summary
              title="Customer"
              value={`${metrics.customerSatisfaction}%`}
              text="Customer satisfaction score."
            />

          </div>

        </section>

      </div>
    </main>
  );
}

function Kpi({
  label,
  value,
}) {
  return (
    <div className="reporting-kpi-card">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function Summary({
  title,
  value,
  text,
}) {
  return (
    <div className="reporting-summary-box">
      <span>{title}</span>
      <strong>{value}</strong>
      <p>{text}</p>
    </div>
  );
}

export default ExecutiveDashboard;