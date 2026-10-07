import { Link, useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { usePolicies } from "./PolicyContext";
import { useClaims } from "../claim/ClaimContext";

function PolicyDetails() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { getPolicy } =
    usePolicies();

  const { claims } = useClaims();
  const storedPolicy = getPolicy(id);
  const policy = storedPolicy ? { ...storedPolicy, claims: claims.filter(claim =>
    claim.policyId === id || (claim.policyNumber === storedPolicy.policyNumber && claim.ownerId === storedPolicy.ownerId)
  ) } : undefined;

  if (!policy) {
    return (
      <>
        

        <main className="policy-page">

          <div className="policy-empty-page">

            <h1>
              Policy Not Found
            </h1>

            <button
              className="policy-primary-button"
              onClick={() =>
                navigate("/policies")
              }
            >
              Back to Policies
            </button>

          </div>

        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="policy-details-page">

        <div className="policy-details-container">

          {/* HEADER */}

          <div className="policy-details-header">

            <div>

              <span className="policy-badge">
                POLICY DETAILS
              </span>

              <h1>
                {policy.policyNumber}
              </h1>

              <p>
                {policy.policyHolderName}
              </p>

            </div>

            <div className="policy-details-header-actions">

              <Link
                to="/policies"
                className="policy-reset-button"
              >
                ← Policies
              </Link>

              <Link
                to={`/policies/${id}/edit`}
                className="policy-save-button"
              >
                Edit Policy
              </Link>

            </div>

          </div>


          {/* STATUS */}

          <div className="policy-detail-status-row">

            <span
              className={`policy-status-badge ${policy.status
                .toLowerCase()
                .replace(" ", "-")}`}
            >
              {policy.status}
            </span>

            <span className="policy-category-badge">
              {policy.category}
            </span>

            <span>
              {policy.policyType} Insurance
            </span>

          </div>


          {/* SUMMARY */}

          <section className="policy-detail-card">

            <div className="policy-detail-card-header">

              <h2>
                Policy Summary
              </h2>

              <span>
                POL-09
              </span>

            </div>

            <div className="policy-summary-grid">

              <SummaryItem
                label="Policy Number"
                value={
                  policy.policyNumber
                }
              />

              <SummaryItem
                label="Policy Holder"
                value={
                  policy.policyHolderName
                }
              />

              <SummaryItem
                label="Provider"
                value={policy.provider}
              />

              <SummaryItem
                label="Policy Type"
                value={policy.policyType}
              />

              <SummaryItem
                label="Start Date"
                value={policy.startDate}
              />

              <SummaryItem
                label="End Date"
                value={policy.endDate}
              />

              <SummaryItem
                label="Premium"
                value={`₹${Number(
                  policy.premiumAmount
                ).toLocaleString("en-IN")}`}
              />

              <SummaryItem
                label="Status"
                value={policy.status}
              />

            </div>

          </section>


          {/* COVERAGE */}

          <section className="policy-detail-card">

            <div className="policy-detail-card-header">

              <h2>
                Coverage Snapshot
              </h2>

              <span>
                POL-10
              </span>

            </div>

            <div className="coverage-snapshot">

              <div>

                <span>
                  Coverage Amount
                </span>

                <strong>
                  ₹
                  {Number(
                    policy.coverageAmount
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <div>

                <span>
                  Premium
                </span>

                <strong>
                  ₹
                  {Number(
                    policy.premiumAmount
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>

              </div>

              <div>

                <span>
                  Policy Period
                </span>

                <strong>
                  {policy.startDate}
                  {" → "}
                  {policy.endDate}
                </strong>

              </div>

            </div>

          </section>


          {/* CLAIMS */}

          <section className="policy-detail-card">

            <div className="policy-detail-card-header">

              <h2>
                Associated Claims
              </h2>

              <span>
                POL-11
              </span>

            </div>

            {policy.claims?.length ? (

              <div className="associated-claims">

                {policy.claims.map(
                  (claim) => (

                    <div
                      className="claim-item"
                      key={claim.id}
                    >

                      <div>

                        <strong>
                          <Link to={`/claims/${claim.id}`}>{claim.claimNumber}</Link>
                        </strong>

                        <span>
                          {claim.title}
                        </span>

                      </div>

                      <span>
                        {claim.status}
                      </span>

                      <strong>
                        {claim.amount == null ? 'Amount not provided' : `₹${Number(claim.amount).toLocaleString('en-IN')}`}
                      </strong>

                    </div>

                  )
                )}

              </div>

            ) : (

              <div className="policy-empty-inline">

                No claims are associated with
                this policy.

              </div>

            )}

          </section>


          {/* TIMELINE */}

          <section className="policy-detail-card">

            <div className="policy-detail-card-header">

              <h2>
                Policy Timeline
              </h2>

              <span>
                POL-12
              </span>

            </div>

            <div className="policy-timeline">

              {policy.timeline?.map(
                (item, index) => (

                  <div
                    className="timeline-item"
                    key={`${item.date}-${index}`}
                  >

                    <div className="timeline-dot" />

                    <div>

                      <span>
                        {item.date}
                      </span>

                      <strong>
                        {item.title}
                      </strong>

                      <p>
                        {item.description}
                      </p>

                    </div>

                  </div>

                )
              )}

            </div>

          </section>


          {/* ACTIONS */}

          <div className="policy-detail-actions">

            <Link
              to={`/policies/${id}/attachments`}
              className="policy-outline-button"
            >
              Attachments
            </Link>

            <Link
              to={`/policies/${id}/reminder`}
              className="policy-outline-button"
            >
              Renewal Reminder
            </Link>

          </div>

        </div>

      </main>

      <Footer />
    </>
  );
}

function SummaryItem({
  label,
  value,
}) {
  return (
    <div className="summary-item">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>
  );
}

export default PolicyDetails;
