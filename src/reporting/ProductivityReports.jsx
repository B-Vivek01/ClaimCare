import { Link } from "react-router-dom";

import {
  useReporting,
} from "./ReportingContext";

function ProductivityReports() {
  const {
    metrics,
  } = useReporting();

  const teams = [
    {
      name: "Medical Claims",
      completed: 342,
      target: 380,
      productivity: 90,
    },
    {
      name: "Motor Claims",
      completed: 287,
      target: 320,
      productivity: 89,
    },
    {
      name: "Property Claims",
      completed: 198,
      target: 240,
      productivity: 83,
    },
    {
      name: "Support Team",
      completed: 200,
      target: 230,
      productivity: 87,
    },
  ];

  return (
    <main className="reporting-page">
      <div className="reporting-container">

        <div className="reporting-header">

          <div>
            <span className="reporting-badge">
              RPT-05
            </span>

            <h1>
              Productivity Reports
            </h1>

            <p>
              View productivity metrics for
              authorized teams.
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

          <div className="reporting-productivity-main">

            <div>
              <span>
                OVERALL PRODUCTIVITY
              </span>

              <strong>
                {metrics.productivity}%
              </strong>
            </div>

          </div>

          <div className="reporting-table-wrapper">

            <table className="reporting-table">

              <thead>
                <tr>
                  <th>Team</th>
                  <th>Completed</th>
                  <th>Target</th>
                  <th>Productivity</th>
                </tr>
              </thead>

              <tbody>

                {teams.map(
                  (team) => (
                    <tr key={team.name}>

                      <td>
                        <strong>
                          {team.name}
                        </strong>
                      </td>

                      <td>
                        {team.completed}
                      </td>

                      <td>
                        {team.target}
                      </td>

                      <td>
                        <span className="reporting-status">
                          {team.productivity}%
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

export default ProductivityReports;