import {
  Link,
  useParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useClaims } from "./ClaimContext";

function ClaimTimeline() {
  const { id } =
    useParams();

  const { getClaim } =
    useClaims();

  const claim =
    getClaim(id);

  if (!claim) {
    return (
      <div className="claim-empty-page">
        Claim not found.
      </div>
    );
  }

  return (
    <>

      <main className="claim-page">

        <div className="claim-container">

          <div className="claim-header">

            <div>

              <span className="claim-badge">
                CLAIM TIMELINE
              </span>

              <h1>
                {claim.claimNumber}
              </h1>

              <p>
                Claim activity and milestones.
              </p>

            </div>

            <Link
              to={`/claims/${id}`}
              className="claim-secondary-button"
            >
              ← Claim Details
            </Link>

          </div>


          {/* EXPECTED NEXT STEP */}

          <section className="claim-next-step-card">

            <span>
              EXPECTED NEXT STEP
            </span>

            <strong>
              {claim.expectedNextStep}
            </strong>

          </section>


          {/* MILESTONES */}

          <section className="claim-detail-card">

            <div className="claim-card-heading">

              <div>

                <span>
                  CLM-22
                </span>

                <h2>
                  Claim Milestones
                </h2>

              </div>

            </div>

            <div className="claim-milestones">

              {claim.milestones?.map(
                (
                  milestone,
                  index
                ) => (

                  <div
                    className={`claim-milestone ${milestone.status}`}
                    key={`${milestone.title}-${index}`}
                  >

                    <div className="claim-milestone-dot">

                      {milestone.status ===
                      "completed"
                        ? "✓"
                        : index + 1}

                    </div>

                    <strong>
                      {milestone.title}
                    </strong>

                    <span>
                      {capitalize(
                        milestone.status
                      )}
                    </span>

                  </div>

                )
              )}

            </div>

          </section>


          {/* ACTIVITY */}

          <section className="claim-detail-card">

            <div className="claim-card-heading">

              <div>

                <span>
                  CLM-13 / CLM-21
                </span>

                <h2>
                  Activity Timeline
                </h2>

              </div>

            </div>

            <div className="claim-timeline">

              {claim.timeline?.length ? (

                claim.timeline
                  .slice()
                  .reverse()
                  .map(
                    (
                      item,
                      index
                    ) => (

                      <div
                        className="claim-timeline-item"
                        key={`${item.date}-${index}`}
                      >

                        <div className="claim-timeline-dot" />

                        <div>

                          <span>
                            {item.date}
                          </span>

                          <strong>
                            {item.title}
                          </strong>

                          <p>
                            {
                              item.description
                            }
                          </p>

                        </div>

                      </div>

                    )
                  )

              ) : (

                <div className="claim-empty-inline">
                  No claim activity available.
                </div>

              )}

            </div>

          </section>

        </div>

      </main>

      <Footer />
    </>
  );
}

function capitalize(
  value
) {
  return value
    .charAt(0)
    .toUpperCase() +
    value.slice(1);
}

export default ClaimTimeline;