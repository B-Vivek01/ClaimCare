import {
  useState,
} from "react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const initialFlags = [
  {
    id: "FLAG-001",
    name: "Advanced Search",
    description:
      "Enable enhanced search capabilities.",
    environment: "Production",
    enabled: true,
  },
  {
    id: "FLAG-002",
    name: "Workflow Automation",
    description:
      "Enable automated workflow rules.",
    environment: "Production",
    enabled: true,
  },
  {
    id: "FLAG-003",
    name: "Advanced Reporting",
    description:
      "Enable advanced reporting views.",
    environment: "Staging",
    enabled: false,
  },
  {
    id: "FLAG-004",
    name: "AI Claim Summary",
    description:
      "Future AI-powered claim summaries.",
    environment: "Development",
    enabled: false,
  },
];

function AdminFeatureFlags() {
  const [
    flags,
    setFlags,
  ] = useState(
    initialFlags
  );

  const toggleFlag = (
    id
  ) => {
    setFlags(
      (previous) =>
        previous.map(
          (flag) =>
            flag.id === id
              ? {
                  ...flag,
                  enabled:
                    !flag.enabled,
                }
              : flag
        )
    );
  };

  return (
    <>
      <Navbar />

      <main className="admin-page">
        <div className="admin-container">

          <AdminHeader
            code="ADM-13"
            title="Feature Flags"
            description="Enable or disable supported product features according to authorized configuration."
          />


          <section className="admin-card">

            <div className="admin-card-header">

              <div>
                <span>
                  FEATURE CONTROL
                </span>

                <h2>
                  Product Feature Flags
                </h2>
              </div>

              <strong>
                {flags.filter(
                  (flag) =>
                    flag.enabled
                ).length} enabled
              </strong>

            </div>


            <div className="admin-feature-list">

              {flags.map(
                (flag) => (

                  <div
                    key={flag.id}
                    className="admin-feature-row"
                  >

                    <div className="admin-feature-icon">
                      🚩
                    </div>


                    <div className="admin-feature-content">

                      <span>
                        {flag.id}
                      </span>

                      <h3>
                        {flag.name}
                      </h3>

                      <p>
                        {flag.description}
                      </p>

                      <small>
                        Environment:{" "}
                        {flag.environment}
                      </small>

                    </div>


                    <button
                      className={
                        flag.enabled
                          ? "admin-toggle active"
                          : "admin-toggle"
                      }
                      onClick={() =>
                        toggleFlag(
                          flag.id
                        )
                      }
                    >
                      <span />
                    </button>


                    <strong
                      className={
                        flag.enabled
                          ? "admin-flag-enabled"
                          : "admin-flag-disabled"
                      }
                    >
                      {flag.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </strong>

                  </div>

                )
              )}

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

export default AdminFeatureFlags;