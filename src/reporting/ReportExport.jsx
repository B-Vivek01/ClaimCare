import { Link } from "react-router-dom";

import {
  useReporting,
} from "./ReportingContext";

function ReportExport() {
  const {
    reports,
    exportReport,
  } = useReporting();

  return (
    <main className="reporting-page">
      <div className="reporting-container">

        <div className="reporting-header">

          <div>
            <span className="reporting-badge">
              RPT-14
            </span>

            <h1>
              Export Reports
            </h1>

            <p>
              Export permitted reporting
              data.
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
                      {report.type} ·{" "}
                      {report.date}
                    </small>
                  </div>

                  <button
                    className="reporting-primary-button"
                    onClick={() =>
                      exportReport(
                        report
                      )
                    }
                  >
                    Export JSON
                  </button>

                </div>
              )
            )}

          </div>

        </section>

      </div>
    </main>
  );
}

export default ReportExport;