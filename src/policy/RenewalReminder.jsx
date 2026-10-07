import { useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import { usePolicies } from "./PolicyContext";

function RenewalReminder() {
  const { id } = useParams();

  const {
    getPolicy,
    updatePolicy,
  } = usePolicies();

  const policy = getPolicy(id);

  const [enabled, setEnabled] =
    useState(
      policy?.renewalReminder ?? true
    );

  const [days, setDays] =
    useState(
      policy?.reminderDays ?? 30
    );

  const [saved, setSaved] =
    useState(false);

  if (!policy) {
    return (
      <div className="policy-empty-page">
        Policy not found.
      </div>
    );
  }

  const handleSave = () => {
    updatePolicy(id, {
      renewalReminder: enabled,
      reminderDays: Number(days),
    });

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <>

      <main className="policy-page">

        <div className="policy-container">

          <div className="policy-header">

            <div>

              <span className="policy-badge">
                POL-08
              </span>

              <h1>
                Renewal Reminder
              </h1>

              <p>
                Manage renewal information for{" "}
                {policy.policyNumber}.
              </p>

            </div>

          </div>


          <section className="policy-card">

            <div className="policy-form">

              <div className="renewal-date-card">

                <span>
                  Policy Renewal Date
                </span>

                <strong>
                  {policy.endDate}
                </strong>

              </div>


              <div className="policy-checkbox-row">

                <input
                  id="renewal"
                  type="checkbox"
                  checked={enabled}
                  onChange={(event) =>
                    setEnabled(
                      event.target.checked
                    )
                  }
                />

                <label htmlFor="renewal">
                  Enable renewal reminder
                </label>

              </div>


              {enabled && (

                <div className="policy-field renewal-days">

                  <label>
                    Remind me before renewal
                  </label>

                  <select
                    value={days}
                    onChange={(event) =>
                      setDays(
                        event.target.value
                      )
                    }
                  >

                    <option value="7">
                      7 days before
                    </option>

                    <option value="15">
                      15 days before
                    </option>

                    <option value="30">
                      30 days before
                    </option>

                    <option value="60">
                      60 days before
                    </option>

                    <option value="90">
                      90 days before
                    </option>

                  </select>

                </div>

              )}


              <div className="renewal-action-box">

                <strong>
                  Reminder action
                </strong>

                <p>
                  The configured reminder information
                  will be available when renewal
                  processing is supported.
                </p>

              </div>


              {saved && (

                <div className="policy-success">

                  ✓ Renewal reminder saved.

                </div>

              )}


              <div className="policy-actions">

                <button
                  className="policy-save-button"
                  onClick={handleSave}
                >
                  Save Reminder
                </button>

              </div>

            </div>

          </section>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default RenewalReminder;