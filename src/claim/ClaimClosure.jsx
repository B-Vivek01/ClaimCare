import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Footer from "../components/Footer";

import { useClaims } from "./ClaimContext";
import { useAuth } from "../auth/AuthContext";

function ClaimClosure() {
  const { profile } = useAuth();
  const staff = ['admin','operations'].includes(profile?.role);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const perform = async (action, destination) => {
    if (busy) return;
    setBusy(true); setError(''); setSaved(false);
    try {
      if (!await action()) throw new Error('The change was not saved. Please retry.');
      setSaved(true);
      if (destination) navigate(destination);
    } catch (problem) { setError(problem.message); }
    finally { setBusy(false); }
  };
  const { id } =
    useParams();

  const navigate =
    useNavigate();

  const {
    getClaim,
    updateClaim,
    updateClosure,
    archiveClaim,
    reopenClaim,
  } = useClaims();

  const claim =
    getClaim(id);

  const [checklist, setChecklist] =
    useState(
      claim?.closure
        ?.checklistCompleted ||
        false
    );

  const [feedbackRequested, setFeedbackRequested] =
    useState(
      claim?.closure
        ?.feedbackRequested ||
        false
    );

  const [rating, setRating] =
    useState(
      claim?.closure?.rating ||
        0
    );

  const [notes, setNotes] =
    useState(
      claim?.closure?.notes ||
        ""
    );

  const [saved, setSaved] =
    useState(false);

  if (!claim) {
    return (
      <div className="claim-empty-page">
        Claim not found.
      </div>
    );
  }

  const saveClosure =
    () => perform(() => updateClosure(id, {
        checklistCompleted:
          checklist,

        feedbackRequested:
          feedbackRequested,

        rating,

        notes,
      }));

  const closeClaim =
    () => {
      if (!checklist) {
        return;
      }

      perform(() => updateClaim(id, {
        status: "Closed",
        expectedNextStep: "Claim review is complete.",

        progress: 100,

        closure: {
          checklistCompleted:
            checklist,

          feedbackRequested:
            feedbackRequested,

          rating: rating || null,

          notes,
        },

        timeline: [
          ...(claim.timeline ||
            []),

          {
            date: new Date()
              .toISOString()
              .split("T")[0],

            title:
              "Claim Closed",

            description:
              "Claim closure was completed.",
          },
        ],
      }), `/claims/${id}`);
    };

  const handleArchive =
    () => {
      perform(() => archiveClaim(id), "/claims");
    };

  const handleReopen =
    () => {
      perform(() => reopenClaim(id));
    };

  return (
    <>

      <main className="claim-page">

        <div className="claim-container">

          <div className="claim-header">

            <div>

              <span className="claim-badge">
                CLAIM CLOSURE
              </span>

              <h1>
                Closure Review
              </h1>

              <p>
                {claim.claimNumber}
              </p>

            </div>

            <Link
              to={`/claims/${id}`}
              className="claim-secondary-button"
            >
              ← Claim Details
            </Link>

          </div>


          {/* CHECKLIST */}

          <section className="claim-detail-card">

            <div className="claim-card-heading">

              <div>

                <span>
                  CLM-34
                </span>

                <h2>
                  Closure Checklist
                </h2>

              </div>

            </div>

            <label className="claim-check-row">

              <input
                type="checkbox"
                checked={
                  checklist
                }
                disabled={!staff || busy}
                onChange={(event) =>
                  setChecklist(
                    event.target.checked
                  )
                }
              />

              <span>
                All required closure information
                has been reviewed.
              </span>

            </label>

          </section>


          {/* FEEDBACK */}

          <section className="claim-detail-card">

            <div className="claim-card-heading">

              <div>

                <span>
                  CLM-35 / CLM-36
                </span>

                <h2>
                  Customer Feedback
                </h2>

              </div>

            </div>

            <label className="claim-check-row">

              <input
                type="checkbox"
                checked={
                  feedbackRequested
                }
                disabled={!staff || busy}
                onChange={(event) =>
                  setFeedbackRequested(
                    event.target.checked
                  )
                }
              />

              <span>
                Request customer feedback.
              </span>

            </label>


            <div className="claim-rating">

              <span>
                Customer Rating
              </span>

              <div>

                {[1, 2, 3, 4, 5].map(
                  (item) => (

                    <button
                      key={item}
                      type="button"
                      disabled={!staff || busy}
                      aria-label={`Set rating to ${item} out of 5`}
                      className={
                        item <= rating
                          ? "rating-star selected"
                          : "rating-star"
                      }
                      onClick={() =>
                        setRating(
                          item
                        )
                      }
                    >
                      ★
                    </button>

                  )
                )}

              </div>

            </div>

          </section>


          {/* CLOSURE NOTES */}

          <section className="claim-detail-card">

            <div className="claim-card-heading">

              <div>

                <span>
                  CLM-37
                </span>

                <h2>
                  Closure Notes
                </h2>

              </div>

            </div>

            <textarea
              disabled={!staff || busy}
              className="claim-closure-textarea"
              value={notes}
              onChange={(event) =>
                setNotes(
                  event.target.value
                )
              }
              placeholder="Enter closure notes..."
            />

          </section>


          {error && <p role="alert">{error}</p>}
          {saved && (

            <div className="claim-success">

              ✓ Claim change saved.

            </div>

          )}


          {/* ACTIONS */}

          <div className="claim-closure-actions">

            <button
              disabled={!staff || busy}
              className="claim-secondary-button"
              onClick={
                saveClosure
              }
            >
              Save Closure
            </button>

            {claim.status !==
              "Closed" && (

              <button
                className="claim-primary-button"
                disabled={
                  !staff || busy || !checklist
                }
                onClick={
                  closeClaim
                }
              >
                Complete Closure
              </button>

            )}

            {claim.status ===
              "Closed" && (

              <button
                disabled={busy}
                className="claim-danger-button"
                onClick={
                  handleArchive
                }
              >
                Archive Claim
              </button>

            )}

            {claim.status ===
              "Closed" && (

              <button
                disabled={busy}
                className="claim-secondary-button"
                onClick={
                  handleReopen
                }
              >
                Request Reopen
              </button>

            )}

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default ClaimClosure;
