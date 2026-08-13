import {
  useState,
} from "react";

import { Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AdminConfiguration() {
  const [
    activeTab,
    setActiveTab,
  ] = useState(
    "Master Data"
  );

  const [
    autoAssignment,
    setAutoAssignment,
  ] = useState(true);

  const [
    notifications,
    setNotifications,
  ] = useState(true);

  const [
    slaEscalation,
    setSlaEscalation,
  ] = useState(true);

  return (
    <>
      <Navbar />

      <main className="admin-page">
        <div className="admin-container">

          <AdminHeader
            code="ADM-10 → ADM-14"
            title="Administration Configuration"
            description="Configure supported platform reference data, workflows and notification behavior."
          />


          <section className="admin-card">

            <div className="admin-config-tabs">

              {[
                "Master Data",
                "Workflow Settings",
                "Notification Settings",
                "Environment",
              ].map(
                (tab) => (

                  <button
                    key={tab}
                    className={
                      activeTab ===
                      tab
                        ? "active"
                        : ""
                    }
                    onClick={() =>
                      setActiveTab(
                        tab
                      )
                    }
                  >
                    {tab}
                  </button>

                )
              )}

            </div>


            {activeTab ===
              "Master Data" && (

              <div className="admin-config-content">

                <h2>
                  Master Data
                </h2>

                <p>
                  Manage configurable reference
                  values used across the application.
                </p>


                <div className="admin-config-list">

                  <ConfigRow
                    title="Claim Categories"
                    description="Medical, Motor, Property and other claim categories."
                  />

                  <ConfigRow
                    title="Document Categories"
                    description="Reference categories used during document classification."
                  />

                  <ConfigRow
                    title="Policy Categories"
                    description="Available policy category values."
                  />

                  <ConfigRow
                    title="Priority Values"
                    description="High, Medium and Low operational priorities."
                  />

                </div>

              </div>

            )}


            {activeTab ===
              "Workflow Settings" && (

              <div className="admin-config-content">

                <h2>
                  Workflow Settings
                </h2>

                <p>
                  Configure supported workflow behavior.
                </p>


                <Toggle
                  label="Automatic Assignment"
                  description="Allow configured workflow rules to assign new work."
                  checked={autoAssignment}
                  onChange={() =>
                    setAutoAssignment(
                      !autoAssignment
                    )
                  }
                />


                <Toggle
                  label="SLA Escalation"
                  description="Enable configured SLA warning and escalation behavior."
                  checked={slaEscalation}
                  onChange={() =>
                    setSlaEscalation(
                      !slaEscalation
                    )
                  }
                />

              </div>

            )}


            {activeTab ===
              "Notification Settings" && (

              <div className="admin-config-content">

                <h2>
                  Notification Settings
                </h2>

                <p>
                  Configure supported notification behavior.
                </p>


                <Toggle
                  label="System Notifications"
                  description="Enable application notifications for supported events."
                  checked={notifications}
                  onChange={() =>
                    setNotifications(
                      !notifications
                    )
                  }
                />


                <ConfigRow
                  title="Email Templates"
                  description="Manage authorized notification email templates."
                />

                <ConfigRow
                  title="SMS Templates"
                  description="Manage authorized SMS notification templates."
                />

              </div>

            )}


            {activeTab ===
              "Environment" && (

              <div className="admin-config-content">

                <h2>
                  Protected Environment Configuration
                </h2>

                <p>
                  Administrative configuration values
                  may be displayed only where explicitly
                  authorized. Secrets must never be exposed
                  in the frontend.
                </p>


                <div className="admin-security-notice">

                  <span>
                    🔒
                  </span>

                  <div>
                    <strong>
                      Protected Configuration
                    </strong>

                    <p>
                      Sensitive environment values are
                      intentionally not displayed here.
                    </p>
                  </div>

                </div>

              </div>

            )}

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}) {
  return (
    <div className="admin-toggle-row">

      <div>
        <strong>
          {label}
        </strong>

        <p>
          {description}
        </p>
      </div>

      <button
        className={
          checked
            ? "admin-toggle active"
            : "admin-toggle"
        }
        onClick={onChange}
      >
        <span />
      </button>

    </div>
  );
}

function ConfigRow({
  title,
  description,
}) {
  return (
    <div className="admin-config-row">

      <div>
        <strong>
          {title}
        </strong>

        <p>
          {description}
        </p>
      </div>

      <button>
        Manage
      </button>

    </div>
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

export default AdminConfiguration;