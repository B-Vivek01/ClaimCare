import { Link } from "react-router-dom";

import {
  useReporting,
} from "./ReportingContext";

function ReportingDashboard() {
  const {
    metrics,
    reports,
  } = useReporting();

  return (
    <main className="reporting-page">
      <div className="reporting-container">

        <div className="reporting-header">

          <div>
            <span className="reporting-badge">
              REPORTING & ANALYTICS
            </span>

            <h1>
              Reporting & Analytics
            </h1>

            <p>
              Monitor claims, operations,
              SLA performance, productivity
              and financial metrics.
            </p>
          </div>

        </div>

        <section className="reporting-kpi-grid">

          <Kpi
            label="TOTAL CLAIMS"
            value={metrics.totalClaims}
          />

          <Kpi
            label="COMPLETED"
            value={metrics.completedClaims}
          />

          <Kpi
            label="PENDING"
            value={metrics.pendingClaims}
          />

          <Kpi
            label="ESCALATED"
            value={metrics.escalatedClaims}
          />

          <Kpi
            label="SLA COMPLIANCE"
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
            label="CUSTOMER SATISFACTION"
            value={`${metrics.customerSatisfaction}%`}
          />

        </section>

        <section className="reporting-module-grid">

          <ReportCard
            to="/reports/daily"
            id="RPT-01"
            icon="📅"
            title="Daily Reports"
            text="View daily operational reports."
          />

          <ReportCard
            to="/reports/weekly"
            id="RPT-02"
            icon="📆"
            title="Weekly Reports"
            text="Review weekly performance."
          />

          <ReportCard
            to="/reports/monthly"
            id="RPT-03"
            icon="🗓️"
            title="Monthly Reports"
            text="Analyze monthly results."
          />

          <ReportCard
            to="/reports/sla"
            id="RPT-04"
            icon="⏱️"
            title="SLA Reports"
            text="Monitor SLA performance."
          />

          <ReportCard
            to="/reports/productivity"
            id="RPT-05"
            icon="⚡"
            title="Productivity"
            text="Measure team productivity."
          />

          <ReportCard
            to="/reports/executive"
            id="RPT-06"
            icon="📈"
            title="Executive Dashboard"
            text="View executive-level KPIs."
          />

          <ReportCard
            to="/reports/operations"
            id="RPT-07"
            icon="⚙️"
            title="Operations Dashboard"
            text="Monitor operational performance."
          />

          <ReportCard
            to="/reports/customer"
            id="RPT-08"
            icon="👥"
            title="Customer Dashboard"
            text="View customer-facing metrics."
          />

          <ReportCard
            to="/reports/financial"
            id="RPT-09"
            icon="💰"
            title="Financial Dashboard"
            text="Review financial metrics."
          />

          <ReportCard
            to="/reports/trends"
            id="RPT-10"
            icon="📊"
            title="Trends"
            text="Analyze time-based trends."
          />

          <ReportCard
            to="/reports/export"
            id="RPT-14"
            icon="⬇️"
            title="Export Reports"
            text="Export permitted report data."
          />

          <ReportCard
            to="/reports/custom"
            id="RPT-15"
            icon="🛠️"
            title="Custom Reports"
            text="Configure custom reports."
          />

        </section>

        <section className="reporting-card">

          <div className="reporting-card-header">

            <div>
              <span>
                RECENT REPORTS
              </span>

              <h2>
                Latest Reports
              </h2>
            </div>

          </div>

          <div className="reporting-table-wrapper">

            <table className="reporting-table">

              <thead>
                <tr>
                  <th>Report</th>
                  <th>Type</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th>Claims</th>
                  <th>SLA</th>
                </tr>
              </thead>

              <tbody>

                {reports.map(
                  (report) => (
                    <tr
                      key={report.id}
                    >
                      <td>
                        <strong>
                          {report.name}
                        </strong>

                        <small>
                          {report.id}
                        </small>
                      </td>

                      <td>
                        {report.type}
                      </td>

                      <td>
                        {report.category}
                      </td>

                      <td>
                        {report.date}
                      </td>

                      <td>
                        {report.totalClaims}
                      </td>

                      <td>
                        <span className="reporting-status">
                          {report.slaCompliance}%
                        </span>
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

function ReportCard({
  to,
  id,
  icon,
  title,
  text,
}) {
  return (
    <Link
      to={to}
      className="reporting-module-card"
    >
      <div className="reporting-module-icon">
        {icon}
      </div>

      <span>{id}</span>

      <h3>{title}</h3>

      <p>{text}</p>

      <strong>→</strong>
    </Link>
  );
}

export default ReportingDashboard;