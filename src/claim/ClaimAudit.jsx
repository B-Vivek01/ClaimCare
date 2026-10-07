import {
  Link,
  useParams,
} from "react-router-dom";

import Footer from "../components/Footer";

import { useClaims } from "./ClaimContext";

function ClaimAudit() {
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
                CLM-40
              </span>

              <h1>
                Audit History
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


          <section className="claim-detail-card">

            <div className="claim-audit-list">

              {claim.statusHistory
                ?.length ? (

                claim.statusHistory.map(
                  (
                    item,
                    index
                  ) => (

                    <div
                      className="claim-audit-item"
                      key={index}
                    >

                      <div className="claim-audit-icon">
                        ✓
                      </div>

                      <div>

                        <strong>
                          Status Changed
                        </strong>

                        <p>
                          {item.from}
                          {" → "}
                          {item.to}
                        </p>

                        <span>
                          {item.date}
                        </span>

                      </div>

                    </div>

                  )
                )

              ) : (

                <div className="claim-empty-inline">

                  No audit events available.

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

export default ClaimAudit;