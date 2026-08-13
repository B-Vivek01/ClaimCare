import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function IdentityVerification() {
  const navigate = useNavigate();

  /*
   * This status will eventually come from the backend.
   *
   * Possible states:
   * verified
   * pending
   * incomplete
   * rejected
   */

  const [verificationStatus, setVerificationStatus] =
    useState("incomplete");

  const [status, setStatus] = useState("idle");

  const verificationData = {
    verified: {
      title: "Identity Verified",
      description:
        "Your identity has been successfully verified.",
      badge: "Verified",
    },

    pending: {
      title: "Verification Pending",
      description:
        "Your identity verification is currently being reviewed.",
      badge: "Pending",
    },

    incomplete: {
      title: "Verification Incomplete",
      description:
        "Your identity verification has not been completed.",
      badge: "Action Required",
    },

    rejected: {
      title: "Verification Unsuccessful",
      description:
        "Your identity verification could not be completed.",
      badge: "Action Required",
    },
  };

  const current =
    verificationData[verificationStatus];

  const handleContinue = async () => {
    setStatus("processing");

    try {
      /*
       * Backend integration point.
       *
       * Replace this with the actual identity
       * verification workflow/API.
       */

      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      /*
       * For now, simulate moving to pending.
       */

      setVerificationStatus("pending");
      setStatus("success");
    } catch (error) {
      setStatus("error");
    }
  };

  const handleRetry = () => {
    setStatus("idle");
    setVerificationStatus("incomplete");
  };

  const getStatusClass = () => {
    if (verificationStatus === "verified") {
      return "identity-status verified";
    }

    if (verificationStatus === "pending") {
      return "identity-status pending";
    }

    return "identity-status action-required";
  };

  return (
    <>
      <Navbar />

      <main className="identity-verification-page">

        <div className="identity-verification-container">

          {/* HEADER */}

          <div className="identity-verification-header">

            <div>

              <span className="identity-badge">
                PROFILE
              </span>

              <h1>
                Identity Verification
              </h1>

              <p>
                View the current status of your identity
                verification.
              </p>

            </div>

            <button
              type="button"
              className="identity-back-button"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              ← Dashboard
            </button>

          </div>


          {/* STATUS CARD */}

          <section className="identity-verification-card">

            <div className="identity-card-header">

              <div className="identity-shield-icon">
                ✓
              </div>

              <div>

                <h2>
                  Verification Status
                </h2>

                <p>
                  Your current identity verification
                  status is shown below.
                </p>

              </div>

            </div>


            {/* STATUS */}

            <div className={getStatusClass()}>

              <div className="identity-status-icon">

                {verificationStatus === "verified" && "✓"}

                {verificationStatus === "pending" && "..."}

                {verificationStatus === "incomplete" && "!"}

                {verificationStatus === "rejected" && "!"}

              </div>

              <div className="identity-status-content">

                <div className="identity-status-title-row">

                  <h3>
                    {current.title}
                  </h3>

                  <span>
                    {current.badge}
                  </span>

                </div>

                <p>
                  {current.description}
                </p>

              </div>

            </div>


            {/* VERIFIED */}

            {verificationStatus === "verified" && (

              <div className="identity-next-action verified-action">

                <div className="identity-action-icon">
                  ✓
                </div>

                <div>

                  <strong>
                    No action required
                  </strong>

                  <p>
                    Your identity verification is
                    complete.
                  </p>

                </div>

              </div>

            )}


            {/* PENDING */}

            {verificationStatus === "pending" && (

              <div className="identity-next-action pending-action">

                <div className="identity-action-icon">
                  i
                </div>

                <div>

                  <strong>
                    Verification is under review
                  </strong>

                  <p>
                    No further action is required
                    while the verification is being
                    reviewed.
                  </p>

                </div>

              </div>

            )}


            {/* INCOMPLETE */}

            {verificationStatus === "incomplete" && (

              <div className="identity-next-action">

                <div className="identity-action-icon">
                  !
                </div>

                <div>

                  <strong>
                    Next action required
                  </strong>

                  <p>
                    Continue the identity verification
                    process to complete your profile
                    verification.
                  </p>

                </div>

              </div>

            )}


            {/* REJECTED */}

            {verificationStatus === "rejected" && (

              <div className="identity-next-action rejected-action">

                <div className="identity-action-icon">
                  !
                </div>

                <div>

                  <strong>
                    Verification needs attention
                  </strong>

                  <p>
                    Review the verification requirements
                    and try again.
                  </p>

                </div>

              </div>

            )}


            {/* ACTION BUTTON */}

            {(verificationStatus === "incomplete" ||
              verificationStatus === "rejected") && (

              <div className="identity-actions">

                <button
                  type="button"
                  className="identity-primary-button"
                  onClick={
                    verificationStatus === "rejected"
                      ? handleRetry
                      : handleContinue
                  }
                  disabled={
                    status === "processing"
                  }
                >
                  {status === "processing"
                    ? "Processing..."
                    : verificationStatus === "rejected"
                    ? "Try Again"
                    : "Continue Verification"}
                </button>

              </div>

            )}


            {/* SUCCESS */}

            {status === "success" && (

              <div className="identity-success">

                ✓ Verification process started.

              </div>

            )}


            {/* ERROR */}

            {status === "error" && (

              <div className="identity-error">

                Unable to start the verification process.
                Please try again.

              </div>

            )}

          </section>


          {/* STATUS GUIDE */}

          <section className="identity-status-guide">

            <h2>
              Verification status
            </h2>

            <div className="identity-guide-grid">

              <div className="identity-guide-item">

                <span className="guide-verified">
                  ✓
                </span>

                <div>

                  <strong>
                    Verified
                  </strong>

                  <p>
                    Identity verification is complete.
                  </p>

                </div>

              </div>


              <div className="identity-guide-item">

                <span className="guide-pending">
                  ...
                </span>

                <div>

                  <strong>
                    Pending
                  </strong>

                  <p>
                    Verification is being reviewed.
                  </p>

                </div>

              </div>


              <div className="identity-guide-item">

                <span className="guide-required">
                  !
                </span>

                <div>

                  <strong>
                    Action Required
                  </strong>

                  <p>
                    Additional verification action is
                    required.
                  </p>

                </div>

              </div>

            </div>

          </section>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default IdentityVerification;