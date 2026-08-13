import { Link } from "react-router-dom";

function CTA() {
  return (
    <section className="cta">

      <div className="cta-content">

        <h2>
          Ready to get started?
        </h2>

        <p>
          Create your ClaimCare account and begin managing
          your claim journey.
        </p>

        <div className="cta-actions">

          <Link to="/register" className="primary-btn">
            Create Account
          </Link>

          <Link to="/contact" className="secondary-btn">
            Contact Us
          </Link>

        </div>

      </div>

    </section>
  );
}

export default CTA;