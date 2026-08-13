import { Link } from "react-router-dom";

import {
  useReporting,
} from "./ReportingContext";

function DailyReports() {
  const {
    getReportsByType,
  } = useReporting();

  const reports =
    getReportsByType("Daily");

  return (
    <ReportList
      title="Daily Reports"
      code="RPT-01"
      description="Select and view daily operational reports."
      reports={reports}
    />
  );
}

function ReportList({
  title,
  code,
  description,
  reports,
}) {
  return (
    <main className="reporting-page">
      <div className="reporting-container">

        <div className="reporting-header">

          <div>
            <span className="reporting-badge">
              {code}
            </span>

            <h1>{title}</h1>

            <p>{description}</p>
          </div>

          <Link
            to="/reports"
            className="reporting-secondary-button"
          >
            ← Reports
          </Link>

        </div>

        <section className="reporting-card">

          {reports.length === 0 ? (
            <div className="reporting-empty">
              No reports available.
            </div>
          ) : (
            <div className="reporting-table-wrapper">

              <table className="reporting-table">

                <thead>
                  <tr>
                    <th>Report</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Completed</th>
                    <th>Pending</th>
                    <th>Escalated</th>
                    <th>SLA</th>
                  </tr>
                </thead>

                <tbody>

                  {reports.map(
                    (report) => (
                      <tr key={report.id}>

                        <td>
                          <strong>
                            {report.name}
                          </strong>

                          <small>
                            {report.id}
                          </small>
                        </td>

                        <td>
                          {report.date}
                        </td>

                        <td>
                          {report.totalClaims}
                        </td>

                        <td>
                          {report.completed}
                        </td>

                        <td>
                          {report.pending}
                        </td>

                        <td>
                          {report.escalated}
                        </td>

                        <td>
                          {report.slaCompliance}%
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
  );
}

export default DailyReports;