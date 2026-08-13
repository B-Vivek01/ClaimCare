import { Link } from "react-router-dom";

import {
  useReporting,
} from "./ReportingContext";

function OperationsDashboard() {
  const {
    metrics,
  } = useReporting();

  const queues = [
    {
      name: "New Claims",
      count: 48,
    },
    {
      name: "Document Review",
      count: 32,
    },
    {
      name: "Pending Customer",
      count: 24,
    },
    {
      name: "Escalated",
      count: metrics.escalatedClaims,
    },
  ];

  return (
    <main className="reporting-page">
      <div className="reporting-container">

        <div className="reporting-header">

          <div>
            <span className="reporting-badge">
              RPT-07
            </span>

            <h1>
              Operations Dashboard
            </h1>

            <p>
              Operational queues, claim
              volumes, SLA and productivity.
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

          <div className="reporting-kpi-card">
            <span>
              TOTAL VOLUME
            </span>

            <strong>
              {metrics.totalClaims}
            </strong>
          </div>

          <div className="reporting-kpi-card">
            <span>
              PENDING
            </span>

            <strong>
              {metrics.pendingClaims}
            </strong>
          </div>

          <div className="reporting-kpi-card">
            <span>
              ESCALATED
            </span>

            <strong>
              {metrics.escalatedClaims}
            </strong>
          </div>

          <div className="reporting-kpi-card">
            <span>
              SLA
            </span>

            <strong>
              {metrics.slaCompliance}%
            </strong>
          </div>

        </section>

        <section className="reporting-card">

          <div className="reporting-card-header">

            <div>
              <span>
                OPERATIONAL QUEUES
              </span>

              <h2>
                Current Workload
              </h2>
            </div>

          </div>

          <div className="reporting-queue-grid">

            {queues.map(
              (queue) => (
                <div
                  key={queue.name}
                  className="reporting-queue-box"
                >
                  <span>
                    {queue.name}
                  </span>

                  <strong>
                    {queue.count}
                  </strong>

                  <small>
                    items
                  </small>
                </div>
              )
            )}

          </div>

        </section>

      </div>
    </main>
  );
}

export default OperationsDashboard;