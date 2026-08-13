import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminReports() {
  const reports = [
    {
      title: "User Activity Report",
      value: "1,248",
      description:
        "Recent user and account activity.",
      icon: "👥",
    },
    {
      title: "Role & Permission Report",
      value: "12",
      description:
        "Configured roles and access mappings.",
      icon: "🔐",
    },
    {
      title: "Audit Activity Report",
      value: "2,481",
      description:
        "Administrative events recorded.",
      icon: "📋",
    },
    {
      title: "System Health Report",
      value: "99.8%",
      description:
        "Current monitored service availability.",
      icon: "🖥️",
    },
  ];

  return (
    <>
      <Navbar />

      <main className="admin-page">
        <div className="admin-container">

          <AdminHeader
            code="ADMIN REPORTING"
            title="Administration Reports"
            description="View authorized administrative and platform reports."
          />


          <section className="admin-report-grid">

            {reports.map(
              (report) => (

                <article
                  key={report.title}
                  className="admin-report-card"
                >

                  <div className="admin-report-icon">
                    {report.icon}
                  </div>

                  <span>
                    REPORT
                  </span>

                  <h3>
                    {report.title}
                  </h3>

                  <strong>
                    {report.value}
                  </strong>

                  <p>
                    {report.description}
                  </p>

                  <button>
                    View Report
                  </button>

                </article>

              )
            )}

          </section>


          <section className="admin-card">

            <div className="admin-card-header">

              <div>
                <span>
                  REPORTING
                </span>

                <h2>
                  Report Controls
                </h2>
              </div>

            </div>


            <div className="admin-report-controls">

              <div>
                <label>
                  Reporting Period
                </label>

                <select>
                  <option>
                    Today
                  </option>

                  <option>
                    This Week
                  </option>

                  <option>
                    This Month
                  </option>

                  <option>
                    This Quarter
                  </option>
                </select>
              </div>


              <div>
                <label>
                  Export Format
                </label>

                <select>
                  <option>
                    CSV
                  </option>

                  <option>
                    PDF
                  </option>

                  <option>
                    Excel
                  </option>
                </select>
              </div>


              <button className="admin-primary-button">
                Export Report
              </button>

            </div>

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

function AdminHeader({
  code,
  title,
  description,
}) {
  return (
    <div className="admin-header">

      <div>

        <span className="admin-badge">
          {code}
        </span>

        <h1>
          {title}
        </h1>

        <p>
          {description}
        </p>

      </div>

      <Link
        to="/admin"
        className="admin-secondary-button"
      >
        ← Admin Dashboard
      </Link>

    </div>
  );
}

export default AdminReports;