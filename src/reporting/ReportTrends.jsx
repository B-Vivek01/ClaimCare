import { useClaims } from "../claim/ClaimContext";
import { Link } from "react-router-dom";

function ReportTrends() {
  const { claims } = useClaims();
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(); date.setDate(1); date.setMonth(date.getMonth() - 5 + index);
    const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    return { month: date.toLocaleDateString(undefined, { month: 'short', year: 'numeric' }), value: claims.filter(claim => String(claim.createdAt).startsWith(period)).length };
  });

  const max =
    Math.max(
      1, ...months.map(
        (item) => item.value
      )
    );

  return (
    <main className="reporting-page">
      <div className="reporting-container">

        <div className="reporting-header">

          <div>
            <span className="reporting-badge">
              RPT-10 / RPT-12
            </span>

            <h1>
              Trends & Charts
            </h1>

            <p>
              Analyze time-based claim
              volume trends.
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
                CLAIM VOLUME
              </span>

              <h2>
                Monthly Trend
              </h2>
            </div>

          </div>

          <div className="reporting-chart">

            {months.map(
              (item) => (
                <div
                  className="reporting-chart-column"
                  key={item.month}
                >

                  <div className="reporting-chart-value">
                    {item.value}
                  </div>

                  <div className="reporting-chart-track">

                    <div
                      className="reporting-chart-bar"
                      style={{
                        height: `${
                          (item.value /
                            max) *
                          100
                        }%`,
                      }}
                    />

                  </div>

                  <span>
                    {item.month}
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

export default ReportTrends;