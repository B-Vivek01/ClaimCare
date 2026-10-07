import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { onAuthStateChanged } from "../backend/auth";
import { doc, getDoc, updateDoc } from "../backend/profiles";

import { auth, db } from "../backend/session";

function PersonalDetails() {
  const [user, setUser] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dateOfBirth: ""
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setStatus("error");
        return;
      }

      setUser(currentUser);

      try {
        const customerRef = doc(db, "customers", currentUser.uid);
        const customerSnap = await getDoc(customerRef);

        if (customerSnap.exists()) {
          const data = customerSnap.data();

          const fullName = data.name || "";
          const nameParts = fullName.trim().split(" ");

          const firstName = nameParts[0] || "";
          const lastName = nameParts.slice(1).join(" ");

          setFormData({
            firstName,
            lastName,
            email: data.email || "",
            mobile: data.mobile || "",
            dateOfBirth: data.dateOfBirth || ""
          });

          setStatus("idle");
        } else {
          setStatus("error");
        }
      } catch (error) {
        console.error(error);
        setStatus("error");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: ""
      }));
    }

    if (status !== "idle") {
      setStatus("idle");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    if (
      formData.dateOfBirth &&
      new Date(formData.dateOfBirth) > new Date()
    ) {
      newErrors.dateOfBirth =
        "Date of birth cannot be in the future.";
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
    setStatus("saving");

    try {
      const customerRef = doc(db, "customers", user.uid);

      await updateDoc(customerRef, {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        mobile: formData.mobile,
        dateOfBirth: formData.dateOfBirth
      });

      setStatus("success");
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  };

  if (status === "loading") {
    return (
      <>
        <Navbar />
        <main className="personal-details-page">
          <div className="personal-details-container">
            <h2>Loading your profile...</h2>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="personal-details-page">
        <div className="personal-details-container">

          {/* PAGE HEADER */}

          <div className="personal-details-header">
            <div>
              <span className="personal-details-badge">
                PROFILE
              </span>

              <h1>Personal Details</h1>

              <p>
                View and update your personal information.
              </p>
            </div>
          </div>

          {/* CONTENT */}

          <section className="personal-details-card">

            <div className="personal-details-card-header">
              <div>
                <h2>Personal information</h2>
                <p>
                  Keep your personal information up to date.
                </p>
              </div>
            </div>

            <form
              className="personal-details-form"
              onSubmit={handleSubmit}
              noValidate
            >

              {/* FIRST NAME */}

              <div className="personal-details-field">
                <label htmlFor="firstName">
                  First Name *
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Enter first name"
                  className={
                    errors.firstName
                      ? "personal-details-input-error"
                      : ""
                  }
                />

                {errors.firstName && (
                  <span className="personal-details-error">
                    {errors.firstName}
                  </span>
                )}
              </div>

              {/* LAST NAME */}

              <div className="personal-details-field">
                <label htmlFor="lastName">
                  Last Name *
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Enter last name"
                  className={
                    errors.lastName
                      ? "personal-details-input-error"
                      : ""
                  }
                />

                {errors.lastName && (
                  <span className="personal-details-error">
                    {errors.lastName}
                  </span>
                )}
              </div>

              {/* EMAIL */}

              <div className="personal-details-field">
                <label htmlFor="email">
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  readOnly
                />
              </div>

              {/* MOBILE */}

              <div className="personal-details-field">
                <label htmlFor="mobile">
                  Mobile Number
                </label>

                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

              {/* DOB */}

              <div className="personal-details-field">
                <label htmlFor="dateOfBirth">
                  Date of Birth
                </label>

                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={
                    errors.dateOfBirth
                      ? "personal-details-input-error"
                      : ""
                  }
                />

                {errors.dateOfBirth && (
                  <span className="personal-details-error">
                    {errors.dateOfBirth}
                  </span>
                )}
              </div>

              {/* ERROR */}

              {status === "error" && (
                <div className="personal-details-server-error">
                  <strong>
                    Unable to save changes
                  </strong>
                  <p>
                    Something went wrong while updating
                    your personal information.
                  </p>
                </div>
              )}

              {/* SUCCESS */}

              {status === "success" && (
                <div className="personal-details-success">
                  <span>✓</span>

                  <div>
                    <strong>
                      Changes saved
                    </strong>
                    <p>
                      Your personal information has been updated successfully.
                    </p>
                  </div>
                </div>
              )}

              {/* BUTTON */}

              <div className="personal-details-actions">
                <button
                  type="submit"
                  className="personal-details-save"
                  disabled={status === "saving"}
                >
                  {status === "saving" ? (
                    <>
                      <span className="personal-details-spinner" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>

            </form>
          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default PersonalDetails;