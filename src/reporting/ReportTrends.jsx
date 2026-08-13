import { Link } from "react-router-dom";

function ReportTrends() {
  const months = [
    {
      month: "Mar",
      value: 620,
    },
    {
      month: "Apr",
      value: 710,
    },
    {
      month: "May",
      value: 780,
    },
    {
      month: "Jun",
      value: 830,
    },
    {
      month: "Jul",
      value: 920,
    },
    {
      month: "Aug",
      value: 980,
    },
  ];

  const max =
    Math.max(
      ...months.map(
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