import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Welcome() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const totalSteps = 3;

  const handleNext = () => {
    if (step < totalSteps) {
      setStep((previous) => previous + 1);
    } else {
      navigate("/dashboard");
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep((previous) => previous - 1);
    }
  };

  const handleSkip = () => {
    navigate("/dashboard");
  };

  return (
    <>
      <Navbar />

      <main className="welcome-page">

        <section className="welcome-card">

          {/* PROGRESS */}

          <div className="welcome-progress">

            <div className="welcome-progress-text">
              Step {step} of {totalSteps}
            </div>

            <div className="welcome-progress-track">

              <div
                className="welcome-progress-bar"
                style={{
                  width: `${(step / totalSteps) * 100}%`
                }}
              />

            </div>

          </div>


          {/* STEP 1 */}

          {step === 1 && (

            <div className="welcome-content">

              <div className="welcome-icon">
                ✓
              </div>

              <span className="welcome-badge">
                WELCOME TO CLAIMCARE
              </span>

              <h1>
                You're all set!
              </h1>

              <p>
                Your account has been successfully
                verified. Let's get you familiar with
                ClaimCare.
              </p>

              <div className="welcome-highlight">

                <strong>
                  Your ClaimCare journey starts here.
                </strong>

                <span>
                  We'll guide you through the important
                  areas of your account.
                </span>

              </div>

            </div>

          )}


          {/* STEP 2 */}

          {step === 2 && (

            <div className="welcome-content">

              <div className="welcome-icon">
                +
              </div>

              <span className="welcome-badge">
                YOUR CLAIMS
              </span>

              <h1>
                Manage your claim journey
              </h1>

              <p>
                Your dashboard will provide access to
                your claims and their available progress
                information.
              </p>

              <div className="welcome-feature-list">

                <div className="welcome-feature">

                  <span>✓</span>

                  <div>
                    <strong>
                      View your claims
                    </strong>

                    <p>
                      Open your current claim information.
                    </p>
                  </div>

                </div>


                <div className="welcome-feature">

                  <span>✓</span>

                  <div>
                    <strong>
                      Track progress
                    </strong>

                    <p>
                      Follow available claim activity
                      and next steps.
                    </p>
                  </div>

                </div>


                <div className="welcome-feature">

                  <span>✓</span>

                  <div>
                    <strong>
                      Complete tasks
                    </strong>

                    <p>
                      Access outstanding actions when
                      they become available.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          )}


          {/* STEP 3 */}

          {step === 3 && (

            <div className="welcome-content">

              <div className="welcome-icon">
                →
              </div>

              <span className="welcome-badge">
                READY TO START
              </span>

              <h1>
                Your dashboard is ready.
              </h1>

              <p>
                From your dashboard you can access
                your claims, tasks, activity,
                notifications and available actions.
              </p>

              <div className="welcome-next-action">

                <span className="welcome-next-icon">
                  →
                </span>

                <div>

                  <strong>
                    Your next step
                  </strong>

                  <p>
                    Continue to your customer dashboard
                    to begin using ClaimCare.
                  </p>

                </div>

              </div>

            </div>

          )}


          {/* ACTIONS */}

          <div className="welcome-actions">

            {step > 1 ? (

              <button
                type="button"
                className="welcome-back-btn"
                onClick={handleBack}
              >
                ← Back
              </button>

            ) : (

              <div />

            )}


            <div className="welcome-right-actions">

              <button
                type="button"
                className="welcome-skip-btn"
                onClick={handleSkip}
              >
                Skip
              </button>

              <button
                type="button"
                className="welcome-next-btn"
                onClick={handleNext}
              >
                {step === totalSteps
                  ? "Go to Dashboard"
                  : "Continue"}
              </button>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Welcome;