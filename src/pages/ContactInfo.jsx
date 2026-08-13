import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase/Firebase.jsx";

function ContactInfo() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    email: "",
    mobile: "",
  });

  const [originalData, setOriginalData] = useState({
    email: "",
    mobile: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("loading");

  const [verificationType, setVerificationType] =
    useState(null);

  const [verificationCode, setVerificationCode] =
    useState("");

  // ===========================================
  // LOAD REGISTERED CUSTOMER DETAILS
  // ===========================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      async (currentUser) => {
        if (!currentUser) {
          navigate("/login");
          return;
        }

        setUser(currentUser);

        try {
          const customerRef = doc(
            db,
            "customers",
            currentUser.uid
          );

          const customerSnap = await getDoc(customerRef);

          if (customerSnap.exists()) {
            const data = customerSnap.data();

            const customerData = {
              email: data.email || "",
              mobile: data.mobile || "",
            };

            setFormData(customerData);
            setOriginalData(customerData);
            setStatus("idle");
          } else {
            setStatus("error");
          }
        } catch (error) {
          console.error(
            "Error loading contact details:",
            error
          );
          setStatus("error");
        }
      }
    );

    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    if (status !== "idle") {
      setStatus("idle");
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile =
        "Mobile number is required.";
    } else if (
      !/^[0-9+\-\s]{10,15}$/.test(formData.mobile)
    ) {
      newErrors.mobile =
        "Enter a valid mobile number.";
    }

    return newErrors;
  };

  // ===========================================
  // SAVE UPDATED DETAILS
  // ===========================================

  const handleSave = async (event) => {
    event.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const emailChanged =
      formData.email !== originalData.email;

    const mobileChanged =
      formData.mobile !== originalData.mobile;

    if (emailChanged) {
      setVerificationType("email");
      setVerificationCode("");
      return;
    }

    if (mobileChanged) {
      setVerificationType("mobile");
      setVerificationCode("");
      return;
    }

    setStatus("saving");

    try {
      const customerRef = doc(
        db,
        "customers",
        user.uid
      );

      await updateDoc(customerRef, {
        email: formData.email,
        mobile: formData.mobile,
      });

      setOriginalData(formData);
      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  // ===========================================
  // VERIFY CHANGES
  // ===========================================

  const handleVerification = async (event) => {
    event.preventDefault();

    if (verificationCode.length !== 6) {
      return;
    }

    setStatus("verifying");

    try {
      const customerRef = doc(
        db,
        "customers",
        user.uid
      );

      await updateDoc(customerRef, {
        email: formData.email,
        mobile: formData.mobile,
      });

      setOriginalData(formData);

      setVerificationType(null);
      setVerificationCode("");

      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  const handleCodeChange = (event) => {
    const value = event.target.value
      .replace(/\D/g, "")
      .slice(0, 6);

    setVerificationCode(value);
  };

  if (status === "loading") {
    return (
      <>
        <Navbar />

        <main className="contact-information-page">
          <div className="contact-information-container">
            <h2>Loading contact details...</h2>
          </div>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="contact-information-page">
        <div className="contact-information-container">

          {/* HEADER */}

          <div className="contact-information-header">
            <div>
              <span className="contact-information-badge">
                PROFILE
              </span>

              <h1>Contact Information</h1>

              <p>
                Manage your email address and mobile
                number.
              </p>
            </div>

            <button
              type="button"
              className="contact-back-button"
              onClick={() => navigate("/dashboard")}
            >
              ← Dashboard
            </button>
          </div>

          {/* CARD */}

          <section className="contact-information-card">

            <div className="contact-information-card-header">
              <h2>Contact details</h2>

              <p>
                Keep your contact information current
                so ClaimCare can reach you.
              </p>
            </div>

            {verificationType ? (
              <form
                className="contact-verification"
                onSubmit={handleVerification}
              >
                <div className="contact-verification-icon">
                  ✓
                </div>

                <span className="contact-information-badge">
                  VERIFICATION REQUIRED
                </span>

                <h2>
                  Verify your{" "}
                  {verificationType === "email"
                    ? "email address"
                    : "mobile number"}
                </h2>

                <p>
                  We've sent a 6-digit verification
                  code to your new{" "}
                  {verificationType === "email"
                    ? "email address."
                    : "mobile number."}
                </p>

                <input
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  value={verificationCode}
                  onChange={handleCodeChange}
                  placeholder="000000"
                  className="contact-verification-input"
                />

                <button
                  type="submit"
                  className="contact-save-button"
                  disabled={
                    verificationCode.length !== 6 ||
                    status === "verifying"
                  }
                >
                  {status === "verifying"
                    ? "Verifying..."
                    : "Verify & Save"}
                </button>

                <button
                  type="button"
                  className="contact-cancel-button"
                  onClick={() => {
                    setVerificationType(null);
                    setVerificationCode("");
                  }}
                >
                  Cancel
                </button>
              </form>
            ) : (
              <form
                className="contact-information-form"
                onSubmit={handleSave}
                noValidate
              >

                {/* EMAIL */}

                <div className="contact-field">
                  <label htmlFor="email">
                    Email Address *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={
                      errors.email
                        ? "contact-input-error"
                        : ""
                    }
                  />

                  {errors.email && (
                    <span className="contact-error">
                      {errors.email}
                    </span>
                  )}

                  <small>
                    A verification code may be required
                    when changing your email.
                  </small>
                </div>

                {/* MOBILE */}

                <div className="contact-field">
                  <label htmlFor="mobile">
                    Mobile Number *
                  </label>

                  <input
                    id="mobile"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    className={
                      errors.mobile
                        ? "contact-input-error"
                        : ""
                    }
                  />

                  {errors.mobile && (
                    <span className="contact-error">
                      {errors.mobile}
                    </span>
                  )}

                  <small>
                    A verification code may be required
                    when changing your mobile number.
                  </small>
                </div>

                {/* SUCCESS */}

                {status === "success" && (
                  <div className="contact-success">
                    <span>✓</span>

                    <div>
                      <strong>
                        Contact information updated
                      </strong>

                      <p>
                        Your contact details have been
                        saved successfully.
                      </p>
                    </div>
                  </div>
                )}

                {/* ERROR */}

                {status === "error" && (
                  <div className="contact-server-error">
                    Unable to save your changes.
                    Please try again.
                  </div>
                )}

                {/* BUTTON */}

                <div className="contact-actions">
                  <button
                    type="submit"
                    className="contact-save-button"
                    disabled={status === "saving"}
                  >
                    {status === "saving"
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>

              </form>
            )}

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default ContactInfo;