import { requireBackend } from "../backend/client";
import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    purpose: "",
    subject: "",
    message: ""
  });

  const [errors, setErrors] = useState({});

  const [status, setStatus] = useState("idle");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value
    }));

    // Remove field error when user starts correcting it
    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: ""
      }));
    }

    // Remove general error when editing
    if (status === "error") {
      setStatus("idle");
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Enter a valid email address.";
    }

    if (formData.phone.trim()) {
      const phonePattern = /^[0-9+\-\s()]{7,20}$/;

      if (!phonePattern.test(formData.phone)) {
        newErrors.phone = "Enter a valid phone number.";
      }
    }

    if (!formData.purpose) {
      newErrors.purpose = "Please select a purpose.";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required.";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required.";
    } else if (formData.message.trim().length < 10) {
      newErrors.message =
        "Message must contain at least 10 characters.";
    }

    return newErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setStatus("idle");
      return;
    }

    setErrors({});
    setStatus("loading");

    try {
      const { error } = await requireBackend().rpc('submit_support_request', { details: formData });
      if (error) throw error;

      setStatus("success");

      setFormData({
        name: "",
        email: "",
        phone: "",
        purpose: "",
        subject: "",
        message: ""
      });
    } catch (error) {
      setErrors({ general: error.message || "Your request could not be submitted." });
      setStatus("error");
    }
  };

  const handleSendAnother = () => {
    setStatus("idle");
  };

  return (
    <>
      <Navbar />

      <main className="contact-page">

        {/* HERO */}

        <section className="contact-hero">

          <div className="contact-hero-content">

            <span className="contact-badge">
              CONTACT CLAIMCARE
            </span>

            <h1>
              How can we help?
            </h1>

            <p>
              Send us your question or enquiry and
              provide the information needed for us
              to understand your request.
            </p>

          </div>

        </section>


        {/* CONTACT CONTENT */}

        <section className="contact-section">

          <div className="contact-grid">

            {/* CONTACT INFORMATION */}

            <div className="contact-information">

              <span className="contact-section-label">
                Get in Touch
              </span>

              <h2>
                Tell us what you need help with.
              </h2>

              <p className="contact-description">
                Use the form to submit a support,
                sales or general enquiry.
              </p>


              <div className="contact-info-list">

                <div className="contact-info-item">

                  <div className="contact-info-icon">
                    ?
                  </div>

                  <div>
                    <h3>
                      Support
                    </h3>

                    <p>
                      For questions about using
                      ClaimCare and your claim journey.
                    </p>
                  </div>

                </div>


                <div className="contact-info-item">

                  <div className="contact-info-icon">
                    $
                  </div>

                  <div>
                    <h3>
                      Sales
                    </h3>

                    <p>
                      For questions about ClaimCare
                      services and offerings.
                    </p>
                  </div>

                </div>


                <div className="contact-info-item">

                  <div className="contact-info-icon">
                    i
                  </div>

                  <div>
                    <h3>
                      General Enquiries
                    </h3>

                    <p>
                      For general questions about
                      ClaimCare.
                    </p>
                  </div>

                </div>

              </div>


              <div className="contact-help-card">

                <h3>
                  Looking for quick answers?
                </h3>

                <p>
                  Browse the frequently asked questions
                  before submitting an enquiry.
                </p>

                <Link to="/faq">
                  Visit FAQ →
                </Link>

              </div>

            </div>


            {/* CONTACT FORM */}

            <div className="contact-form-wrapper">

              {status === "success" ? (

                <div className="contact-success">

                  <div className="success-icon">
                    ✓
                  </div>

                  <h2>
                    Message submitted
                  </h2>

                  <p>
                    Your enquiry has been submitted
                    successfully.
                  </p>

                  <p>
                    You can submit another enquiry
                    if required.
                  </p>

                  <button
                    type="button"
                    className="primary-btn"
                    onClick={handleSendAnother}
                  >
                    Send Another Message
                  </button>

                </div>

              ) : (

                <form
                  className="contact-form"
                  onSubmit={handleSubmit}
                  noValidate
                >

                  <div className="form-header">

                    <h2>
                      Send us a message
                    </h2>

                    <p>
                      Fields marked with *
                      are required.
                    </p>

                  </div>


                  {/* NAME */}

                  <div className="form-field">

                    <label htmlFor="name">
                      Name *
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      className={
                        errors.name
                          ? "input-error"
                          : ""
                      }
                    />

                    {errors.name && (
                      <span className="field-error">
                        {errors.name}
                      </span>
                    )}

                  </div>


                  {/* EMAIL */}

                  <div className="form-field">

                    <label htmlFor="email">
                      Email *
                    </label>

                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      className={
                        errors.email
                          ? "input-error"
                          : ""
                      }
                    />

                    {errors.email && (
                      <span className="field-error">
                        {errors.email}
                      </span>
                    )}

                  </div>


                  {/* PHONE */}

                  <div className="form-field">

                    <label htmlFor="phone">
                      Phone
                    </label>

                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter your phone number"
                      className={
                        errors.phone
                          ? "input-error"
                          : ""
                      }
                    />

                    {errors.phone && (
                      <span className="field-error">
                        {errors.phone}
                      </span>
                    )}

                  </div>


                  {/* PURPOSE */}

                  <div className="form-field">

                    <label htmlFor="purpose">
                      Purpose *
                    </label>

                    <select
                      id="purpose"
                      name="purpose"
                      value={formData.purpose}
                      onChange={handleChange}
                      className={
                        errors.purpose
                          ? "input-error"
                          : ""
                      }
                    >

                      <option value="">
                        Select purpose
                      </option>

                      <option value="support">
                        Support
                      </option>

                      <option value="sales">
                        Sales
                      </option>

                      <option value="general">
                        General Enquiry
                      </option>

                    </select>

                    {errors.purpose && (
                      <span className="field-error">
                        {errors.purpose}
                      </span>
                    )}

                  </div>


                  {/* SUBJECT */}

                  <div className="form-field">

                    <label htmlFor="subject">
                      Subject *
                    </label>

                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Enter subject"
                      className={
                        errors.subject
                          ? "input-error"
                          : ""
                      }
                    />

                    {errors.subject && (
                      <span className="field-error">
                        {errors.subject}
                      </span>
                    )}

                  </div>


                  {/* MESSAGE */}

                  <div className="form-field">

                    <label htmlFor="message">
                      Message *
                    </label>

                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Enter your message"
                      className={
                        errors.message
                          ? "input-error"
                          : ""
                      }
                    />

                    <div className="message-meta">
                      <span>
                        {formData.message.length}
                        {" "}characters
                      </span>
                    </div>

                    {errors.message && (
                      <span className="field-error">
                        {errors.message}
                      </span>
                    )}

                  </div>


                  {/* SERVER ERROR */}

                  {status === "error" && (

                    <div className="form-server-error">

                      <strong>
                        Submission failed
                      </strong>

                      <p>
                        We couldn't submit your message.
                        Please try again.
                      </p>

                    </div>

                  )}


                  {/* SUBMIT */}

                  <button
                    type="submit"
                    className="contact-submit"
                    disabled={status === "loading"}
                  >

                    {status === "loading" ? (
                      <>
                        <span className="button-spinner" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Enquiry"
                    )}

                  </button>

                </form>

              )}

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}

export default Contact;
