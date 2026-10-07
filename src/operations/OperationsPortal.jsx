import {
  Link,
  useNavigate,
} from "react-router-dom";

import Footer from "../components/Footer";
import { useEffect } from "react";

import { auth, db } from "../backend/session";

import { onAuthStateChanged } from "../backend/auth";

import { doc, getDoc } from "../backend/profiles";

function OperationsPortal() {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (!user) {
          navigate("/login");
          return;
        }

        const snap = await getDoc(
          doc(db, "customers", user.uid)
        );

        if (!snap.exists()) {
          navigate("/dashboard");
          return;
        }

        const role = snap.data().role;

        if (
          role !== "operations" &&
          role !== "admin"
        ) {
          navigate("/dashboard");
        }
      }
    );

    return () => unsubscribe();
  }, [navigate]);
  return (
    <>

      <main className="operations-page">

        <div className="operations-container">

          <div className="operations-header">

            <div>

              <span className="operations-badge">
                OPERATIONS PORTAL
              </span>

              <h1>
                Operations Dashboard
              </h1>

              <p>
                Manage claims, work queues,
                tasks, customers, documents,
                SLA activity and communications.
              </p>

            </div>

            <div className="operations-user">

              <span>
                Operations
              </span>

              <strong>
                Operations User
              </strong>

            </div>

          </div>


          <section className="operations-summary">

            <div className="operations-summary-card">

              <span>
                OPEN WORK
              </span>

              <strong>
                24
              </strong>

              <small>
                Items requiring attention
              </small>

            </div>


            <div className="operations-summary-card">

              <span>
                ACTIVE CLAIMS
              </span>

              <strong>
                18
              </strong>

              <small>
                Claims currently being handled
              </small>

            </div>


            <div className="operations-summary-card">

              <span>
                SLA AT RISK
              </span>

              <strong>
                4
              </strong>

              <small>
                Items approaching SLA threshold
              </small>

            </div>


            <div className="operations-summary-card">

              <span>
                TASKS
              </span>

              <strong>
                12
              </strong>

              <small>
                Pending operational tasks
              </small>

            </div>

          </section>


          <section className="operations-section">

            <div className="operations-section-header">

              <div>

                <span>
                  OPERATIONS
                </span>

                <h2>
                  Operational Modules
                </h2>

              </div>

            </div>


            <div className="operations-module-grid">


              <OperationCard
                icon="📥"
                code="OPS-01"
                title="Work Queue"
                description="View and manage operational work items and assignments."
                path="/ops/queue"
              />


              <OperationCard
                icon="📋"
                code="OPS-02"
                title="Operations Claims"
                description="View and manage claims from the operations perspective."
                path="/ops/claims"
              />


              <OperationCard
                icon="✓"
                code="OPS-03"
                title="Tasks"
                description="View assigned operational tasks and required actions."
                path="/ops/tasks"
              />


              <OperationCard
                icon="👥"
                code="OPS-04"
                title="Customers"
                description="Access customer information permitted for operations users."
                path="/ops/customers"
              />


              <OperationCard
                icon="📁"
                code="OPS-05"
                title="Documents"
                description="Review documents associated with operational claims."
                path="/ops/documents"
              />


              <OperationCard
                icon="📊"
                code="OPS-06"
                title="Reports"
                description="View operational reporting and performance information."
                path="/ops/reports"
              />


              <OperationCard
                icon="⏱️"
                code="OPS-07"
                title="SLA Dashboard"
                description="Monitor SLA status, aging work and escalation activity."
                path="/ops/sla"
              />


              <OperationCard
                icon="💬"
                code="OPS-08"
                title="Communications"
                description="Manage customer and internal operational communications."
                path="/ops/communications"
              />

            </div>

          </section>


          <section className="operations-section">

            <div className="operations-section-header">

              <div>

                <span>
                  QUICK ACCESS
                </span>

                <h2>
                  Operational Actions
                </h2>

              </div>

            </div>


            <div className="operations-action-grid">
              <Link to="/ops/support" className="operations-action-card"><div><strong>Support inbox</strong><small>Review website contact requests</small></div></Link>
              <Link to="/ops/identity-reviews" className="operations-action-card"><div><strong>Identity reviews</strong><small>Review pending customer documents</small></div></Link>

              <Link
                to="/ops/queue"
                className="operations-action-card"
              >

                <span>
                  📥
                </span>

                <div>

                  <strong>
                    Open Work Queue
                  </strong>

                  <small>
                    Review operational work
                  </small>

                </div>

              </Link>


              <Link
                to="/ops/claims"
                className="operations-action-card"
              >

                <span>
                  📋
                </span>

                <div>

                  <strong>
                    View Claims
                  </strong>

                  <small>
                    Review active claims
                  </small>

                </div>

              </Link>


              <Link
                to="/ops/tasks"
                className="operations-action-card"
              >

                <span>
                  ✓
                </span>

                <div>

                  <strong>
                    View Tasks
                  </strong>

                  <small>
                    Check pending actions
                  </small>

                </div>

              </Link>


              <Link
                to="/ops/sla"
                className="operations-action-card"
              >

                <span>
                  ⏱️
                </span>

                <div>

                  <strong>
                    Monitor SLA
                  </strong>

                  <small>
                    Check SLA and escalation
                  </small>

                </div>

              </Link>

            </div>

          </section>


          <section className="operations-workflow-card">

            <div>

              <span>
                OPERATIONAL WORKFLOW
              </span>

              <h2>
                Claim Processing Flow
              </h2>

              <p>
                Follow the operational flow from
                submitted claim through specialist
                assignment and progress updates.
              </p>

            </div>


            <div className="operations-workflow">

              <WorkflowStep
                number="01"
                title="Claim Submitted"
              />

              <div className="operations-workflow-arrow">
                →
              </div>

              <WorkflowStep
                number="02"
                title="Work Queue"
              />

              <div className="operations-workflow-arrow">
                →
              </div>

              <WorkflowStep
                number="03"
                title="Assignment"
              />

              <div className="operations-workflow-arrow">
                →
              </div>

              <WorkflowStep
                number="04"
                title="Specialist Queue"
              />

              <div className="operations-workflow-arrow">
                →
              </div>

              <WorkflowStep
                number="05"
                title="Task Execution"
              />

              <div className="operations-workflow-arrow">
                →
              </div>

              <WorkflowStep
                number="06"
                title="Progress Update"
              />

            </div>

          </section>


          <section className="operations-notice">

            <div>
              🔐
            </div>

            <div>

              <strong>
                Operations Access
              </strong>

              <p>
                Operational information and actions
                are available only to authorized
                roles according to the application's
                access permissions.
              </p>

            </div>

          </section>

        </div>

      </main>

      <Footer />
    </>
  );
}


function OperationCard({
  icon,
  code,
  title,
  description,
  path,
}) {
  return (
    <Link
      to={path}
      className="operations-module-card"
    >

      <div className="operations-module-icon">
        {icon}
      </div>

      <div className="operations-module-content">

        <span>
          {code}
        </span>

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>

      </div>

      <div className="operations-module-arrow">
        →
      </div>

    </Link>
  );
}


function WorkflowStep({
  number,
  title,
}) {
  return (
    <div className="operations-workflow-step">

      <span>
        {number}
      </span>

      <strong>
        {title}
      </strong>

    </div>
  );
}


export default OperationsPortal;
