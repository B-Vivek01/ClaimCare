import { Link } from "react-router-dom";

import {
  useReporting,
} from "./ReportingContext";

function MonthlyReports() {
  const {
    getReportsByType,
  } = useReporting();

  const reports =
    getReportsByType("Monthly");

  return (
    <main className="reporting-page">
      <div className="reporting-container">

        <div className="reporting-header">

          <div>
            <span className="reporting-badge">
              RPT-03
            </span>

            <h1>
              Monthly Reports
            </h1>

            <p>
              Analyze monthly claims and
              operational performance.
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

          <div className="reporting-table-wrapper">

            <table className="reporting-table">

              <thead>
                <tr>
                  <th>Report</th>
                  <th>Month</th>
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

        </section>

      </div>
    </main>
  );
}

export default MonthlyReports;