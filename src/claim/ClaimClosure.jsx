import {
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useClaims } from "./ClaimContext";

function ClaimClosure() {
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
    () => {
      updateClosure(id, {
        checklistCompleted:
          checklist,

        feedbackRequested:
          feedbackRequested,

        rating,

        notes,
      });

      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    };

  const closeClaim =
    () => {
      if (!checklist) {
        return;
      }

      updateClaim(id, {
        status: "Closed",

        progress: 100,

        closure: {
          checklistCompleted:
            checklist,

          feedbackRequested:
            feedbackRequested,

          rating,

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
      });

      navigate(
        `/claims/${id}`
      );
    };

  const handleArchive =
    () => {
      archiveClaim(id);

      navigate(
        "/claims"
      );
    };

  const handleReopen =
    () => {
      reopenClaim(id);
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


          {saved && (

            <div className="claim-success">

              ✓ Closure information saved.

            </div>

          )}


          {/* ACTIONS */}

          <div className="claim-closure-actions">

            <button
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
                  !checklist
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