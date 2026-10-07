import { Link } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

function Navbar() {
  const { user, profile } = useAuth();
  const dashboard = profile?.role === 'admin' ? '/admin' : profile?.role === 'operations' ? '/ops' : '/dashboard';
  return (
    <header className="navbar">
      <div className="navbar-container">

        <Link to="/" className="logo">
          ClaimCare
        </Link>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/services">Services</Link>
          <Link to="/pricing">Pricing</Link>
          <Link to="/faq">FAQ</Link>
          <Link to="/contact">Contact</Link>
        </nav>

        <div className="nav-actions">
          {user ? <>
            <Link to={dashboard} className="login-btn">Dashboard</Link>
            <Link to="/profile/personal-details" className="register-btn">My profile</Link>
          </> : <>
          <Link to="/login" className="login-btn">
            Login
          </Link>

          <Link to="/register" className="register-btn">
            Register
          </Link>
          </>}
        </div>

      </div>
    </header>
  );
}

export default Navbar;
