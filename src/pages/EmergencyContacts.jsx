import { useRecords } from "../data/useRecords";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function EmergencyContacts() {
  const navigate = useNavigate();



  const [contacts,setContacts] = useRecords("emergency_contacts", true);

  const emptyForm = {
    name: "",
    relationship: "Parent",
    mobile: "",
    email: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
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
    }));

    setStatus("idle");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required.";
    }

    if (!formData.relationship.trim()) {
      newErrors.relationship =
        "Relationship is required.";
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

    if (
      formData.email.trim() &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        formData.email
      )
    ) {
      newErrors.email =
        "Enter a valid email address.";
    }

    return newErrors;
  };

  const openAddForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setErrors({});
    setStatus("idle");
    setShowForm(true);
  };

  const openEditForm = (contact) => {
    setFormData({
      name: contact.name,
      relationship: contact.relationship,
      mobile: contact.mobile,
      email: contact.email,
    });

    setEditingId(contact.id);
    setErrors({});
    setStatus("idle");
    setShowForm(true);
  };

  const closeForm = () => {
    setFormData(emptyForm);
    setEditingId(null);
    setErrors({});
    setStatus("idle");
    setShowForm(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === "saving") return;

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("saving");

    let saved;
    if (editingId) {
      saved = await setContacts((previous) =>
        previous.map((contact) =>
          contact.id === editingId
            ? {
                ...contact,
                ...formData,
              }
            : contact
        )
      );
    } else {
      saved = await setContacts((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          ...formData,
        },
      ]);
    }

    if (!saved) { setStatus("idle"); return; }
    setStatus("success");

    setTimeout(() => {
      closeForm();
    }, 700);
  };

  const handleRemove = (id) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this emergency contact?"
      )
    ) {
      return;
    }

    setContacts((previous) =>
      previous.filter((contact) => contact.id !== id)
    );
  };

  return (
    <>
      <Navbar />

      <main className="emergency-contacts-page">
        <div className="emergency-contacts-container">

          <div className="emergency-contacts-header">
            <div>
              <span className="emergency-badge">
                PROFILE
              </span>

              <h1>Emergency Contacts</h1>

              <p>
                Manage the people who can be contacted when necessary.
              </p>
            </div>

            <button
              type="button"
              className="emergency-back-button"
              onClick={() => navigate("/dashboard")}
            >
              ← Dashboard
            </button>
          </div>

          <section className="emergency-contacts-card">

            <div className="emergency-card-header">
              <div>
                <h2>Your emergency contacts</h2>
                <p>Add, edit or remove an emergency contact.</p>
              </div>

              <button
                type="button"
                className="emergency-add-button"
                onClick={openAddForm}
              >
                + Add Contact
              </button>
            </div>

            {contacts.length === 0 ? (
              <div className="emergency-empty-state">
                <div className="emergency-empty-icon">+</div>

                <h3>No emergency contacts</h3>

                <p>Add an emergency contact to your profile.</p>

                <button
                  type="button"
                  onClick={openAddForm}
                >
                  Add Contact
                </button>
              </div>
            ) : (
              <div className="emergency-contact-list">
                {contacts.map((contact) => (
                  <div
                    className="emergency-contact-item"
                    key={contact.id}
                  >

                    <div className="emergency-contact-avatar">
                      {contact.name.charAt(0).toUpperCase()}
                    </div>

                    <div className="emergency-contact-details">
                      <h3>{contact.name}</h3>

                      <span className="emergency-relationship">
                        {contact.relationship}
                      </span>

                      <div className="emergency-contact-info">
                        <span>📱 {contact.mobile}</span>

                        {contact.email && (
                          <span>✉ {contact.email}</span>
                        )}
                      </div>
                    </div>

                    <div className="emergency-contact-actions">
                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(contact)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="emergency-remove-button"
                        onClick={() =>
                          handleRemove(contact.id)
                        }
                      >
                        Remove
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}

          </section>

          {showForm && (
            <section className="emergency-form-card">

              <div className="emergency-form-header">
                <div>
                  <span className="emergency-badge">
                    {editingId
                      ? "EDIT CONTACT"
                      : "NEW CONTACT"}
                  </span>

                  <h2>
                    {editingId
                      ? "Edit emergency contact"
                      : "Add emergency contact"}
                  </h2>
                </div>

                <button
                  type="button"
                  className="emergency-close-button"
                  onClick={closeForm}
                >
                  ×
                </button>
              </div>

              <form
                className="emergency-form"
                onSubmit={handleSubmit}
                noValidate
              >

                <div className="emergency-field">
                  <label htmlFor="contact-name">
                    Full Name *
                  </label>

                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter full name"
                  />

                  {errors.name && (
                    <span className="emergency-error">
                      {errors.name}
                    </span>
                  )}
                </div>

                <div className="emergency-field">
                  <label htmlFor="relationship">
                    Relationship *
                  </label>

                  <select
                    id="relationship"
                    name="relationship"
                    value={formData.relationship}
                    onChange={handleChange}
                  >
                    <option value="Parent">Parent</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Child">Child</option>
                    <option value="Friend">Friend</option>
                    <option value="Other">Other</option>
                  </select>

                  {errors.relationship && (
                    <span className="emergency-error">
                      {errors.relationship}
                    </span>
                  )}
                </div>

                <div className="emergency-field">
                  <label htmlFor="contact-mobile">
                    Mobile Number *
                  </label>

                  <input
                    id="contact-mobile"
                    name="mobile"
                    type="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                  />

                  {errors.mobile && (
                    <span className="emergency-error">
                      {errors.mobile}
                    </span>
                  )}
                </div>

                <div className="emergency-field">
                  <label htmlFor="contact-email">
                    Email Address
                  </label>

                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@email.com"
                  />

                  {errors.email && (
                    <span className="emergency-error">
                      {errors.email}
                    </span>
                  )}
                </div>

                {status === "success" && (
                  <div className="emergency-success">
                    ✓ Emergency contact saved successfully.
                  </div>
                )}

                <div className="emergency-form-actions">
                  <button
                    type="button"
                    className="emergency-cancel-button"
                    onClick={closeForm}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="emergency-save-button"
                    disabled={status === "saving"}
                  >
                    {status === "saving"
                      ? "Saving..."
                      : editingId
                      ? "Save Changes"
                      : "Add Contact"}
                  </button>
                </div>

              </form>

            </section>
          )}

        </div>
      </main>

      <Footer />
    </>
  );
}

export default EmergencyContacts;
