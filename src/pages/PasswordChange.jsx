import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
} from "firebase/auth";

import { auth } from "../firebase/Firebase.jsx";

function PasswordChange() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
      form: "",
    }));

    setStatus("idle");
  };

  const validatePassword = (password) => {
    const errors = [];

    if (password.length < 8) {
      errors.push("At least 8 characters");
    }

    if (!/[A-Z]/.test(password)) {
      errors.push("At least one uppercase letter");
    }

    if (!/[a-z]/.test(password)) {
      errors.push("At least one lowercase letter");
    }

    if (!/[0-9]/.test(password)) {
      errors.push("At least one number");
    }

    return errors;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword.trim()) {
      newErrors.currentPassword =
        "Current password is required.";
    }

    if (!formData.newPassword) {
      newErrors.newPassword =
        "New password is required.";
    } else {
      const passwordErrors =
        validatePassword(formData.newPassword);

      if (passwordErrors.length > 0) {
        newErrors.newPassword =
          "Password does not meet the required criteria.";
      }
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword =
        "Please confirm your new password.";
    } else if (
      formData.newPassword !==
      formData.confirmPassword
    ) {
      newErrors.confirmPassword =
        "Passwords do not match.";
    }

    if (
      formData.currentPassword &&
      formData.newPassword &&
      formData.currentPassword ===
        formData.newPassword
    ) {
      newErrors.newPassword =
        "New password must be different from the current password.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  /* =========================================================
     CHANGE PASSWORD IN FIREBASE
  ========================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    const isValid = validateForm();

    if (!isValid) {
      return;
    }

    setStatus("saving");

    try {
      const user = auth.currentUser;

      if (!user || !user.email) {
        throw new Error(
          "No authenticated user found."
        );
      }

      // Verify current password
      const credential =
        EmailAuthProvider.credential(
          user.email,
          formData.currentPassword
        );

      await reauthenticateWithCredential(
        user,
        credential
      );

      // Update password
      await updatePassword(
        user,
        formData.newPassword
      );

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      setErrors({});
      setStatus("success");

    } catch (error) {
      console.error("Password error:", error);

      let message =
        "Unable to change your password.";

      switch (error.code) {
        case "auth/invalid-credential":
        case "auth/wrong-password":
          message =
            "Current password is incorrect.";
          break;

        case "auth/weak-password":
          message =
            "New password is too weak.";
          break;

        case "auth/requires-recent-login":
          message =
            "Please login again and try changing your password.";
          break;

        default:
          message = error.message || message;
      }

      setStatus("error");

      setErrors({
        form: message,
      });
    }
  };

  const togglePassword = (field) => {
    setShowPassword((previous) => ({
      ...previous,
      [field]: !previous[field],
    }));
  };

  const passwordRequirements = [
    {
      label: "At least 8 characters",
      valid: formData.newPassword.length >= 8,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(formData.newPassword),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(formData.newPassword),
    },
    {
      label: "One number",
      valid: /[0-9]/.test(formData.newPassword),
    },
  ];

  return (
    <>

      <main className="password-change-page">
        <div className="password-change-container">

          {/* HEADER */}

          <div className="password-change-header">

            <div>

              <span className="password-change-badge">
                SECURITY
              </span>

              <h1>Change Password</h1>

              <p>
                Update your account password securely.
              </p>

            </div>

            <button
              type="button"
              className="password-back-button"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              ← Dashboard
            </button>

          </div>

          {/* CARD */}

          <section className="password-change-card">

            <div className="password-card-header">

              <div className="password-lock-icon">
                🔒
              </div>

              <div>

                <h2>Password</h2>

                <p>
                  Enter your current password and choose
                  a new password.
                </p>

              </div>

            </div>

            <form
              className="password-change-form"
              onSubmit={handleSubmit}
            >

              {/* FORM ERROR */}

              {errors.form && (

                <div className="password-form-error">
                  {errors.form}
                </div>

              )}

              {/* CURRENT PASSWORD */}

              <div className="password-field">

                <label htmlFor="currentPassword">
                  Current Password
                </label>

                <div className="password-input-wrapper">

                  <input
                    id="currentPassword"
                    type={
                      showPassword.current
                        ? "text"
                        : "password"
                    }
                    name="currentPassword"
                    value={
                      formData.currentPassword
                    }
                    onChange={handleChange}
                    placeholder="Enter current password"
                  />

                  <button
                    type="button"
                    className="password-visibility-button"
                    onClick={() =>
                      togglePassword("current")
                    }
                  >
                    {showPassword.current
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

                {errors.currentPassword && (

                  <span className="password-field-error">
                    {errors.currentPassword}
                  </span>

                )}

              </div>

              {/* NEW PASSWORD */}

              <div className="password-field">

                <label htmlFor="newPassword">
                  New Password
                </label>

                <div className="password-input-wrapper">

                  <input
                    id="newPassword"
                    type={
                      showPassword.new
                        ? "text"
                        : "password"
                    }
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />

                  <button
                    type="button"
                    className="password-visibility-button"
                    onClick={() =>
                      togglePassword("new")
                    }
                  >
                    {showPassword.new
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

                {errors.newPassword && (

                  <span className="password-field-error">
                    {errors.newPassword}
                  </span>

                )}

              </div>

              {/* REQUIREMENTS */}

              <div className="password-requirements">

                <strong>
                  Password requirements
                </strong>

                <div className="password-requirements-list">

                  {passwordRequirements.map(
                    (requirement) => (

                      <div
                        key={requirement.label}
                        className={
                          requirement.valid
                            ? "password-requirement valid"
                            : "password-requirement"
                        }
                      >

                        <span>
                          {requirement.valid
                            ? "✓"
                            : "○"}
                        </span>

                        {requirement.label}

                      </div>

                    )
                  )}

                </div>

              </div>

              {/* CONFIRM PASSWORD */}

              <div className="password-field">

                <label htmlFor="confirmPassword">
                  Confirm New Password
                </label>

                <div className="password-input-wrapper">

                  <input
                    id="confirmPassword"
                    type={
                      showPassword.confirm
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    value={
                      formData.confirmPassword
                    }
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />

                  <button
                    type="button"
                    className="password-visibility-button"
                    onClick={() =>
                      togglePassword("confirm")
                    }
                  >
                    {showPassword.confirm
                      ? "Hide"
                      : "Show"}
                  </button>

                </div>

                {errors.confirmPassword && (

                  <span className="password-field-error">
                    {errors.confirmPassword}
                  </span>

                )}

              </div>

              {/* SUCCESS */}

              {status === "success" && (

                <div className="password-success">

                  <span>✓</span>

                  <div>

                    <strong>
                      Password changed successfully
                    </strong>

                    <p>
                      Your Firebase account password has been updated.
                    </p>

                  </div>

                </div>

              )}

              {/* ACTIONS */}

              <div className="password-actions">

                <button
                  type="button"
                  className="password-cancel-button"
                  onClick={() =>
                    navigate("/dashboard")
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="password-save-button"
                  disabled={status === "saving"}
                >
                  {status === "saving"
                    ? "Updating..."
                    : "Change Password"}
                </button>

              </div>

            </form>

          </section>

          {/* SECURITY NOTE */}

          <section className="password-security-note">

            <div className="password-security-icon">
              i
            </div>

            <div>

              <strong>
                Security reminder
              </strong>

              <p>
                Never share your password with anyone.
                Use a unique password for your ClaimCare account.
              </p>

            </div>

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default PasswordChange;