import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function WorkflowSettings() {
  const [
    emailEnabled,
    setEmailEnabled,
  ] = useState(true);

  const [
    smsEnabled,
    setSmsEnabled,
  ] = useState(true);

  const [
    escalationEnabled,
    setEscalationEnabled,
  ] = useState(true);

  const [
    scheduledEnabled,
    setScheduledEnabled,
  ] = useState(true);

  const [
    frequency,
    setFrequency,
  ] = useState(
    "Every 15 minutes"
  );

  return (
    <>
      <Navbar />

      <main className="workflow-page">

        <div className="workflow-container">

          <div className="workflow-header">

            <div>

              <span className="workflow-badge">
                WORKFLOW CONFIGURATION
              </span>

              <h1>
                Workflow Settings
              </h1>

              <p>
                Configure workflow-triggered
                notifications and scheduled jobs.
              </p>

            </div>

            <Link
              to="/workflow"
              className="workflow-secondary-button"
            >
              ← Operations
            </Link>

          </div>


          <section className="workflow-settings-grid">

            <div className="workflow-setting-card">

              <span>
                WF-14
              </span>

              <h2>
                Workflow Notifications
              </h2>

              <p>
                Configure notification channels
                for workflow events.
              </p>


              <Toggle
                label="Email Notifications"
                enabled={
                  emailEnabled
                }
                onChange={() =>
                  setEmailEnabled(
                    (value) =>
                      !value
                  )
                }
              />


              <Toggle
                label="SMS Notifications"
                enabled={
                  smsEnabled
                }
                onChange={() =>
                  setSmsEnabled(
                    (value) =>
                      !value
                  )
                }
              />


              <Toggle
                label="Escalation Notifications"
                enabled={
                  escalationEnabled
                }
                onChange={() =>
                  setEscalationEnabled(
                    (value) =>
                      !value
                  )
                }
              />

            </div>


            <div className="workflow-setting-card">

              <span>
                WF-15
              </span>

              <h2>
                Scheduled Jobs
              </h2>

              <p>
                Configure the workflow job
                execution frequency.
              </p>


              <Toggle
                label="Scheduled Jobs"
                enabled={
                  scheduledEnabled
                }
                onChange={() =>
                  setScheduledEnabled(
                    (value) =>
                      !value
                  )
                }
              />


              <label className="workflow-label">
                Execution Frequency
              </label>

              <select
                className="workflow-select"
                value={
                  frequency
                }
                onChange={(event) =>
                  setFrequency(
                    event.target.value
                  )
                }
              >

                <option>
                  Every 5 minutes
                </option>

                <option>
                  Every 15 minutes
                </option>

                <option>
                  Every 30 minutes
                </option>

                <option>
                  Every hour
                </option>

                <option>
                  Daily
                </option>

              </select>

            </div>

          </section>


          <div className="workflow-settings-save">

            <button className="workflow-primary-button">
              Save Workflow Settings
            </button>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}

function Toggle({
  label,
  enabled,
  onChange,
}) {
  return (
    <button
      className="workflow-toggle-row"
      onClick={onChange}
    >

      <span>
        {label}
      </span>

      <span
        className={
          enabled
            ? "workflow-toggle active"
            : "workflow-toggle"
        }
      >
        <span />
      </span>

    </button>
  );
}

export default WorkflowSettings;