import {
  useState,
} from "react";

import {
  Link,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  useWorkflow,
} from "./WorkFlowContext";

function AssignmentRules() {
  const {
    rules,
    addRule,
    updateRule,
    deleteRule,
  } = useWorkflow();

  const [
    showForm,
    setShowForm,
  ] = useState(false);

  const [
    name,
    setName,
  ] = useState("");

  const [
    event,
    setEvent,
  ] = useState(
    "Claim Submitted"
  );

  const [
    condition,
    setCondition,
  ] = useState("");

  const [
    action,
    setAction,
  ] = useState("");

  const createRule =
    () => {
      if (
        !name.trim() ||
        !condition.trim() ||
        !action.trim()
      ) {
        return;
      }

      addRule({
        name,
        event,
        condition,
        action,
        enabled: true,
      });

      setName("");
      setCondition("");
      setAction("");

      setShowForm(false);
    };

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
                Assignment Rules
              </h1>

              <p>
                Configure workflow rules and
                automated assignment behavior.
              </p>

            </div>

            <Link
              to="/workflow"
              className="workflow-secondary-button"
            >
              ← Operations
            </Link>

          </div>


          <section className="workflow-list-card">

            <div className="workflow-card-header">

              <div>

                <span>
                  WF-02 / WF-11
                </span>

                <h2>
                  Rules
                </h2>

              </div>

              <button
                className="workflow-primary-button"
                onClick={() =>
                  setShowForm(
                    (value) =>
                      !value
                  )
                }
              >
                + Add Rule
              </button>

            </div>


            {showForm && (

              <div className="workflow-rule-form">

                <div>
                  <label>
                    Rule Name
                  </label>

                  <input
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder="Rule name"
                  />
                </div>


                <div>
                  <label>
                    Trigger Event
                  </label>

                  <select
                    value={event}
                    onChange={(event) =>
                      setEvent(
                        event.target.value
                      )
                    }
                  >

                    <option>
                      Claim Submitted
                    </option>

                    <option>
                      Claim Status Changed
                    </option>

                    <option>
                      SLA Threshold
                    </option>

                    <option>
                      Document Uploaded
                    </option>

                  </select>
                </div>


                <div>
                  <label>
                    Condition
                  </label>

                  <input
                    value={
                      condition
                    }
                    onChange={(event) =>
                      setCondition(
                        event.target.value
                      )
                    }
                    placeholder="Example: Category = Medical"
                  />
                </div>


                <div>
                  <label>
                    Action
                  </label>

                  <input
                    value={action}
                    onChange={(event) =>
                      setAction(
                        event.target.value
                      )
                    }
                    placeholder="Example: Assign to Medical Claims"
                  />
                </div>


                <div className="workflow-form-actions">

                  <button
                    className="workflow-secondary-button"
                    onClick={() =>
                      setShowForm(
                        false
                      )
                    }
                  >
                    Cancel
                  </button>

                  <button
                    className="workflow-primary-button"
                    onClick={
                      createRule
                    }
                  >
                    Save Rule
                  </button>

                </div>

              </div>

            )}


            <div className="workflow-rules">

              {rules.map(
                (rule) => (

                  <div
                    className="workflow-rule"
                    key={
                      rule.id
                    }
                  >

                    <div className="workflow-rule-main">

                      <div>

                        <strong>
                          {
                            rule.name
                          }
                        </strong>

                        <span>
                          {
                            rule.id
                          }
                        </span>

                      </div>

                      <div className="workflow-rule-flow">

                        <span>
                          {
                            rule.event
                          }
                        </span>

                        <b>
                          →
                        </b>

                        <span>
                          {
                            rule.condition
                          }
                        </span>

                        <b>
                          →
                        </b>

                        <span>
                          {
                            rule.action
                          }
                        </span>

                      </div>

                    </div>


                    <div className="workflow-rule-actions">

                      <button
                        className={
                          rule.enabled
                            ? "enabled"
                            : ""
                        }
                        onClick={() =>
                          updateRule(
                            rule.id,
                            {
                              enabled:
                                !rule.enabled,
                            }
                          )
                        }
                      >
                        {rule.enabled
                          ? "Enabled"
                          : "Disabled"}
                      </button>

                      <button
                        className="delete"
                        onClick={() =>
                          deleteRule(
                            rule.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

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

export default AssignmentRules;