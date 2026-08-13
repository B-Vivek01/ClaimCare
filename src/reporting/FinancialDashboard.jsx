import { Link } from "react-router-dom";

import {
  useReporting,
} from "./ReportingContext";

function FinancialDashboard() {
  const {
    metrics,
  } = useReporting();

  const payments = [
    {
      label: "Collected",
      value: metrics.revenue,
    },
    {
      label: "Pending",
      value: 682000,
    },
    {
      label: "Refunds",
      value: 145000,
    },
    {
      label: "Outstanding",
      value: 428000,
    },
  ];

  return (
    <main className="reporting-page">
      <div className="reporting-container">

        <div className="reporting-header">

          <div>
            <span className="reporting-badge">
              RPT-09
            </span>

            <h1>
              Financial Dashboard
            </h1>

            <p>
              View permitted finance and
              payment metrics.
            </p>
          </div>

          <Link
            to="/reports"
            className="reporting-secondary-button"
          >
            ← Reports
          </Link>

        </div>

        <section className="reporting-financial-grid">

          {payments.map(
            (item) => (
              <div
                key={item.label}
                className="reporting-financial-card"
              >
                <span>
                  {item.label}
                </span>

                <strong>
                  ₹
                  {item.value.toLocaleString()}
                </strong>
              </div>
            )
          )}

        </section>

        <section className="reporting-card">

          <div className="reporting-card-header">

            <div>
              <span>
                FINANCIAL OVERVIEW
              </span>

              <h2>
                Revenue Performance
              </h2>
            </div>

          </div>

          <div className="reporting-financial-bar">

            <div
              className="reporting-financial-bar-fill"
              style={{
                width: "78%",
              }}
            />

          </div>

          <p className="reporting-note">
            Current collection performance
            compared with the configured
            reporting target.
          </p>

        </section>

      </div>
    </main>
  );
}

export default FinancialDashboard;