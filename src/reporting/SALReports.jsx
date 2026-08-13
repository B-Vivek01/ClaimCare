import { Link } from "react-router-dom";

import {
  useReporting,
} from "./ReportingContext";

function SLAReports() {
  const {
    metrics,
  } = useReporting();

  const targets = [
    {
      name: "Claims Processing",
      target: 95,
      actual: metrics.slaCompliance,
    },
    {
      name: "Document Review",
      target: 90,
      actual: 88,
    },
    {
      name: "Customer Response",
      target: 92,
      actual: 94,
    },
    {
      name: "Escalation Resolution",
      target: 90,
      actual: 86,
    },
  ];

  return (
    <main className="reporting-page">
      <div className="reporting-container">

        <Header
          code="RPT-04"
          title="SLA Reports"
          description="View SLA performance metrics and details."
        />

        <section className="reporting-card">

          <div className="reporting-card-header">

            <div>
              <span>
                SLA PERFORMANCE
              </span>

              <h2>
                Current SLA Metrics
              </h2>
            </div>

            <strong className="reporting-large-value">
              {metrics.slaCompliance}%
            </strong>

          </div>

          <div className="reporting-progress-list">

            {targets.map(
              (item) => (
                <div
                  className="reporting-progress-item"
                  key={item.name}
                >

                  <div className="reporting-progress-header">

                    <strong>
                      {item.name}
                    </strong>

                    <span>
                      {item.actual}% /{" "}
                      {item.target}%
                    </span>

                  </div>

                  <div className="reporting-progress-track">

                    <div
                      className="reporting-progress-bar"
                      style={{
                        width: `${item.actual}%`,
                      }}
                    />

                  </div>

                </div>
              )
            )}

          </div>

        </section>

      </div>
    </main>
  );
}

function Header({
  code,
  title,
  description,
}) {
  return (
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
  );
}

export default SLAReports;