import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";


import { requireBackend } from "../backend/client";

function Register() {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
    acceptPrivacy: false,
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }

    if (status === "error") {
      setStatus("idle");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must contain at least 2 characters.";
    }

    // Email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    // Mobile
    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required.";
    } else if (!/^[0-9+\-\s()]{7,20}$/.test(formData.mobile.trim())) {
      newErrors.mobile = "Enter a valid mobile number.";
    }

    // Password
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password =
        "Password must contain at least 8 characters.";
    }

    // Confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    // Terms
    if (!formData.acceptTerms) {
      newErrors.acceptTerms =
        "You must accept the Terms of Service.";
    }

    // Privacy
    if (!formData.acceptPrivacy) {
      newErrors.acceptPrivacy =
        "You must provide privacy consent.";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setStatus("loading");

    try {
      const { error } = await requireBackend().auth.signUp({
        email: formData.email.trim(), password: formData.password,
        options: { emailRedirectTo: window.location.origin + '/login', data: {
          name: formData.name.trim(), mobile: formData.mobile.trim(),
          acceptTerms: formData.acceptTerms, acceptPrivacy: formData.acceptPrivacy,
        } },
      });
      if (error) throw error;
      setStatus('verification');

    } catch (error) {
      console.error("Registration error:", error);

      let errorMessage =
        "Unable to create your account. Please try again.";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage =
            "An account already exists with this email address.";
          break;

        case "auth/invalid-email":
          errorMessage =
            "Please enter a valid email address.";
          break;

        case "auth/weak-password":
          errorMessage =
            "Password is too weak. Please use a stronger password.";
          break;

        case "auth/network-request-failed":
          errorMessage =
            "Network error. Please check your internet connection.";
          break;

        default:
          errorMessage =
            error.message || errorMessage;
      }

      setErrors({
        general: errorMessage,
      });

      setStatus("error");
    }
  };

  const handleContinue = () => {
    navigate("/login");
  };

  return (
    <>
      <Navbar />

      <main className="register-page">

        {/* LEFT SIDE */}

        <section className="register-introduction">

          <div className="register-introduction-content">

            <span className="register-badge">
              GET STARTED
            </span>

            <h1>
              Create your ClaimCare account.
            </h1>

            <p>
              Register to begin your ClaimCare journey
              and access the customer experience.
            </p>

            <div className="register-benefits">

              <div className="register-benefit">

                <span>✓</span>

                <div>
                  <strong>
                    Manage your claim journey
                  </strong>

                  <p>
                    Access claim-related information
                    and activities.
                  </p>
                </div>

              </div>

              <div className="register-benefit">

                <span>✓</span>

                <div>
                  <strong>
                    Manage documents
                  </strong>

                  <p>
                    Upload and manage claim-related
                    documents.
                  </p>
                </div>

              </div>

              <div className="register-benefit">

                <span>✓</span>

                <div>
                  <strong>
                    Track progress
                  </strong>

                  <p>
                    Follow available claim status,
                    activities and next steps.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>

        {/* REGISTRATION FORM */}

        <section className="register-form-section">

          {status === "verification" ? (

            <div className="registration-success">

              <div className="registration-success-icon">
                ✓
              </div>

              <span className="register-badge">
                ACCOUNT CREATED
              </span>

              <h2>
                You're almost there.
              </h2>

              <p>
                Your ClaimCare account has been
                requested. Check your email for the confirmation link before signing in.
              </p>

              <button
                type="button"
                className="register-submit"
                onClick={handleContinue}
              >
                Continue to Login
              </button>

              <p className="registration-login-text">
                Already have an account?{" "}
                <Link to="/login">
                  Sign in
                </Link>
              </p>

            </div>

          ) : (

            <form
              className="register-form"
              onSubmit={handleSubmit}
              noValidate
            >

              <div className="register-form-header">

                <h2>
                  Create account
                </h2>

                <p>
                  Enter your details to get started.
                </p>

              </div>

              {/* NAME */}

              <div className="register-field">

                <label htmlFor="name">
                  Full Name *
                </label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={
                    errors.name
                      ? "register-input-error"
                      : ""
                  }
                />

                {errors.name && (
                  <span className="register-field-error">
                    {errors.name}
                  </span>
                )}

              </div>

              {/* EMAIL */}

              <div className="register-field">

                <label htmlFor="email">
                  Email Address *
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className={
                    errors.email
                      ? "register-input-error"
                      : ""
                  }
                />

                {errors.email && (
                  <span className="register-field-error">
                    {errors.email}
                  </span>
                )}

              </div>

              {/* MOBILE */}

              <div className="register-field">

                <label htmlFor="mobile">
                  Mobile Number *
                </label>

                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="Enter your mobile number"
                  className={
                    errors.mobile
                      ? "register-input-error"
                      : ""
                  }
                />

                {errors.mobile && (
                  <span className="register-field-error">
                    {errors.mobile}
                  </span>
                )}

              </div>

              {/* PASSWORD */}

              <div className="register-field">

                <label htmlFor="password">
                  Password *
                </label>

                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  className={
                    errors.password
                      ? "register-input-error"
                      : ""
                  }
                />

                <span className="register-field-hint">
                  Password must contain at least 8 characters.
                </span>

                {errors.password && (
                  <span className="register-field-error">
                    {errors.password}
                  </span>
                )}

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="register-field">

                <label htmlFor="confirmPassword">
                  Confirm Password *
                </label>

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className={
                    errors.confirmPassword
                      ? "register-input-error"
                      : ""
                  }
                />

                {errors.confirmPassword && (
                  <span className="register-field-error">
                    {errors.confirmPassword}
                  </span>
                )}

              </div>

              {/* TERMS */}

              <div className="register-consent">

                <label className="register-checkbox">

                  <input
                    type="checkbox"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                  />

                  <span>
                    I agree to the{" "}
                    <Link
                      to="/terms"
                      target="_blank"
                    >
                      Terms of Service
                    </Link>
                    .
                  </span>

                </label>

                {errors.acceptTerms && (
                  <span className="register-field-error">
                    {errors.acceptTerms}
                  </span>
                )}

              </div>

              {/* PRIVACY */}

              <div className="register-consent">

                <label className="register-checkbox">

                  <input
                    type="checkbox"
                    name="acceptPrivacy"
                    checked={formData.acceptPrivacy}
                    onChange={handleChange}
                  />

                  <span>
                    I acknowledge the{" "}
                    <Link
                      to="/privacy"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </span>

                </label>

                {errors.acceptPrivacy && (
                  <span className="register-field-error">
                    {errors.acceptPrivacy}
                  </span>
                )}

              </div>

              {/* FIREBASE ERROR */}

              {status === "error" && (
                <div className="register-server-error">

                  <strong>
                    Registration failed
                  </strong>

                  <p>
                    {errors.general ||
                      "We couldn't create your account. Please try again."}
                  </p>

                </div>
              )}

              {/* SUBMIT */}

              <button
                type="submit"
                className="register-submit"
                disabled={status === "loading"}
              >

                {status === "loading" ? (
                  <>
                    <span className="register-spinner" />
                    Creating Account...
                  </>
                ) : (
                  "Create Account"
                )}

              </button>

              {/* LOGIN */}

              <p className="registration-login-text">

                Already have an account?{" "}

                <Link to="/login">
                  Sign in
                </Link>

              </p>

            </form>

          )}

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Register;


