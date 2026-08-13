import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-container">

        <div className="footer-brand">

          <h2>ClaimCare</h2>

          <p>
            Supporting you throughout your insurance
            claim journey.
          </p>

        </div>

        <div className="footer-links">

          <div>
            <h4>Company</h4>

            <Link to="/about">About</Link>
            <Link to="/services">Services</Link>
            <Link to="/pricing">Pricing</Link>
          </div>

          <div>
            <h4>Support</h4>

            <Link to="/faq">FAQ</Link>
            <Link to="/contact">Contact</Link>
          </div>

          <div>
            <h4>Legal</h4>

            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>

        </div>

      </div>

      <div className="footer-bottom">
        © 2026 ClaimCare. All rights reserved.
      </div>

    </footer>
  );
}

export default Footer;