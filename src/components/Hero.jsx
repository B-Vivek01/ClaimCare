import { Link } from "react-router-dom";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-content">

        <div className="hero-text">

          <span className="hero-badge">
            Insurance Claims Assistance
          </span>

          <h1>
            Get the support you need
            <span> throughout your claim journey.</span>
          </h1>

          <p>
            ClaimCare helps you organize documents, understand your claim
            progress, respond to requests, and stay informed throughout
            the claims process.
          </p>

          <div className="hero-actions">

            <Link to="/register" className="primary-btn">
              Start Your Claim
            </Link>

            <Link to="/login" className="secondary-btn">
              Login
            </Link>

          </div>

        </div>

        <div className="hero-card">

          <div className="claim-card">

            <h3>Claim Progress</h3>

            <div className="progress-bar">
              <div className="progress-value"></div>
            </div>

            <p>Claim documentation in progress</p>

            <div className="claim-status">
              <span>✓</span>
              Documents submitted
            </div>

            <div className="claim-status">
              <span>✓</span>
              Claim reviewed
            </div>

            <div className="claim-status pending">
              <span>●</span>
              Awaiting next update
            </div>

          </div>

        </div>

      </div>

    </section>
  );
}

export default Hero;