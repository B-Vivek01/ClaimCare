import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const services = [
  {
    name: "Application",
    status: "Operational",
    uptime: "99.99%",
    response: "124 ms",
  },
  {
    name: "Authentication",
    status: "Operational",
    uptime: "99.98%",
    response: "98 ms",
  },
  {
    name: "Claims Service",
    status: "Operational",
    uptime: "99.97%",
    response: "142 ms",
  },
  {
    name: "Document Service",
    status: "Operational",
    uptime: "99.95%",
    response: "176 ms",
  },
  {
    name: "Notification Service",
    status: "Operational",
    uptime: "99.96%",
    response: "112 ms",
  },
];

function AdminSystemHealth() {
  return (
    <>
      <Navbar />

      <main className="admin-page">
        <div className="admin-container">

          <AdminHeader
            code="ADM-17"
            title="System Health"
            description="View system and service health information available to authorized administrators."
          />


          <div className="admin-summary">

            <div className="admin-summary-card">
              <span>
                OVERALL STATUS
              </span>

              <strong className="admin-health-value">
                Healthy
              </strong>
            </div>


            <div className="admin-summary-card">
              <span>
                SERVICES
              </span>

              <strong>
                {services.length}
              </strong>

              <small>
                Monitored services
              </small>
            </div>


            <div className="admin-summary-card">
              <span>
                AVAILABILITY
              </span>

              <strong>
                99.97%
              </strong>
            </div>


            <div className="admin-summary-card">
              <span>
                INCIDENTS
              </span>

              <strong>
                0
              </strong>

              <small>
                Active incidents
              </small>
            </div>

          </div>


          <section className="admin-card">

            <div className="admin-card-header">

              <div>
                <span>
                  SERVICE STATUS
                </span>

                <h2>
                  Platform Health
                </h2>
              </div>

              <span className="admin-status active">
                All Systems Operational
              </span>

            </div>


            <div className="admin-health-list">

              {services.map(
                (service) => (

                  <div
                    key={service.name}
                    className="admin-health-row"
                  >

                    <div className="admin-health-indicator">
                      <span />
                    </div>


                    <div className="admin-health-service">

                      <strong>
                        {service.name}
                      </strong>

                      <small>
                        {service.status}
                      </small>

                    </div>


                    <div>
                      <span>
                        Uptime
                      </span>

                      <strong>
                        {service.uptime}
                      </strong>
                    </div>


                    <div>
                      <span>
                        Response
                      </span>

                      <strong>
                        {service.response}
                      </strong>
                    </div>


                    <span className="admin-status active">
                      Operational
                    </span>

                  </div>

                )
              )}

            </div>

          </section>


          <section className="admin-security-notice">

            <span>
              ℹ️
            </span>

            <div>

              <strong>
                System Health Information
              </strong>

              <p>
                This dashboard displays health information
                available to authorized administrators.
                Sensitive infrastructure details should not
                be exposed through the frontend.
              </p>

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

export default AdminSystemHealth;