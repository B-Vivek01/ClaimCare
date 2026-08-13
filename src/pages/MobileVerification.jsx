import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function MobileVerification() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  // Temporary frontend value.
  // Replace this with the mobile number returned
  // from the registration/backend flow.
  const registeredMobile = "+91 XXXXX XXXXX";

  const handleCodeChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setCode(value);
    setError("");

    if (status === "error" || status === "resent") {
      setStatus("idle");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!code) {
      setError("Verification code is required.");
      return;
    }

    if (code.length !== 6) {
      setError("Enter the 6-digit verification code.");
      return;
    }

    setError("");
    setStatus("loading");

    /*
     * Backend integration point.
     *
     * Replace this simulation with the actual
     * mobile verification API.
     */

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      /*
       * Temporary frontend behavior:
       * any 6-digit code is treated as successful.
       *
       * The backend must perform the actual
       * OTP verification.
       */

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setError(
        "We couldn't verify your mobile number. Please try again."
      );
    }
  };

  const handleResend = async () => {
    setError("");
    setStatus("resending");

    /*
     * Replace with actual resend-mobile-code API.
     */

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 1000)
      );

      setStatus("resent");
    } catch (error) {
      setStatus("error");
      setError(
        "We couldn't resend the verification code. Please try again."
      );
    }
  };

  const handleContinue = () => {
    navigate("/welcome");
  };

  return (
    <>
      <Navbar />

      <main className="mobile-verification-page">

        <section className="mobile-verification-card">

          {status === "success" ? (

            /* SUCCESS STATE */

            <div className="mobile-verification-result">

              <div className="mobile-success-icon">
                ✓
              </div>

              <span className="mobile-verification-badge">
                MOBILE VERIFIED
              </span>

              <h1>
                Mobile number verified
              </h1>

              <p>
                Your mobile number has been confirmed.
                Continue to complete your ClaimCare setup.
              </p>

              <button
                type="button"
                className="mobile-primary-btn"
                onClick={handleContinue}
              >
                Continue
              </button>

            </div>

          ) : (

            /* VERIFICATION FORM */

            <div className="mobile-verification-content">

              <div className="mobile-verification-icon">
                ☎
              </div>

              <span className="mobile-verification-badge">
                MOBILE VERIFICATION
              </span>

              <h1>
                Verify your mobile number
              </h1>

              <p>
                We've sent a verification code to
              </p>

              <strong className="mobile-number">
                {registeredMobile}
              </strong>

              <p className="mobile-helper">
                Enter the 6-digit code to confirm
                your mobile number.
              </p>


              <form onSubmit={handleSubmit}>

                <div className="mobile-code-field">

                  <label htmlFor="mobileVerificationCode">
                    Verification Code
                  </label>

                  <input
                    id="mobileVerificationCode"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={handleCodeChange}
                    placeholder="000000"
                    className={
                      error
                        ? "mobile-code-input error"
                        : "mobile-code-input"
                    }
                    aria-label="6 digit mobile verification code"
                  />

                  <div className="mobile-code-counter">
                    {code.length}/6
                  </div>

                </div>


                {error && (
                  <div className="mobile-verification-error">
                    {error}
                  </div>
                )}


                {status === "resent" && (
                  <div className="mobile-verification-resent">
                    A new verification code has been sent.
                  </div>
                )}


                <button
                  type="submit"
                  className="mobile-primary-btn"
                  disabled={
                    status === "loading" ||
                    status === "resending"
                  }
                >

                  {status === "loading" ? (
                    <>
                      <span className="mobile-spinner" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Mobile"
                  )}

                </button>

              </form>


              <div className="mobile-resend">

                <span>
                  Didn't receive the code?
                </span>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={
                    status === "loading" ||
                    status === "resending"
                  }
                >
                  {status === "resending"
                    ? "Resending..."
                    : "Resend Code"}
                </button>

              </div>


              <div className="mobile-back">

                <Link to="/verify">
                  ← Back to email verification
                </Link>

              </div>

            </div>

          )}

        </section>

      </main>

      <Footer />
    </>
  );
}

export default MobileVerification;