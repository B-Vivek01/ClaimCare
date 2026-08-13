import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function EmailVerification() {
  const navigate = useNavigate();

  const [code, setCode] = useState("");
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  // Temporary frontend value.
  // Replace with the email returned by the registration API.
  const registeredEmail = "your-email@example.com";

  const handleCodeChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setCode(value);
    setError("");

    if (status === "error") {
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
     * email verification API.
     */

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 1200)
      );

      /*
       * Temporary frontend behavior:
       * any 6-digit code is treated as successful.
       *
       * The backend must perform the real verification.
       */

      setStatus("success");
    } catch (error) {
      setStatus("error");
      setError(
        "We couldn't verify your email. Please try again."
      );
    }
  };

  const handleResend = async () => {
    setError("");
    setStatus("resending");

    /*
     * Replace with actual resend-verification API.
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
    navigate("/verify-mobile");
  };

  return (
    <>
      <Navbar />

      <main className="verification-page">

        <section className="verification-card">

          {status === "success" ? (

            /* SUCCESS */

            <div className="verification-result">

              <div className="verification-success-icon">
                ✓
              </div>

              <span className="verification-badge">
                EMAIL VERIFIED
              </span>

              <h1>
                Email verified successfully
              </h1>

              <p>
                Your email address has been confirmed.
                Continue to verify your mobile number.
              </p>

              <button
                type="button"
                className="verification-primary-btn"
                onClick={handleContinue}
              >
                Continue
              </button>

            </div>

          ) : (

            /* VERIFICATION FORM */

            <div className="verification-content">

              <div className="verification-icon">
                @
              </div>

              <span className="verification-badge">
                EMAIL VERIFICATION
              </span>

              <h1>
                Verify your email
              </h1>

              <p>
                We've sent a verification code to
              </p>

              <strong className="verification-email">
                {registeredEmail}
              </strong>

              <p className="verification-helper">
                Enter the 6-digit code to confirm
                your email address.
              </p>


              <form onSubmit={handleSubmit}>

                <div className="verification-code-field">

                  <label htmlFor="verificationCode">
                    Verification Code
                  </label>

                  <input
                    id="verificationCode"
                    type="text"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={code}
                    onChange={handleCodeChange}
                    placeholder="000000"
                    className={
                      error
                        ? "verification-input error"
                        : "verification-input"
                    }
                    aria-label="6 digit verification code"
                  />

                  <div className="verification-code-counter">
                    {code.length}/6
                  </div>

                </div>

                {error && (
                  <div className="verification-error">
                    {error}
                  </div>
                )}

                {status === "resent" && (
                  <div className="verification-resent">
                    A new verification code has been sent.
                  </div>
                )}


                <button
                  type="submit"
                  className="verification-primary-btn"
                  disabled={
                    status === "loading" ||
                    status === "resending"
                  }
                >

                  {status === "loading" ? (
                    <>
                      <span className="verification-spinner" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}

                </button>

              </form>


              <div className="verification-resend">

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


              <div className="verification-back">

                <Link to="/register">
                  ← Back to registration
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

export default EmailVerification;