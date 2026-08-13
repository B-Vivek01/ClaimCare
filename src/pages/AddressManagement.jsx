import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function AddressManagement() {
  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: "Home",
      addressLine1: "123 Main Street",
      addressLine2: "",
      city: "Hyderabad",
      state: "Telangana",
      postalCode: "500001",
      country: "India",
      selected: true,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const emptyForm = {
    type: "Home",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((previous) => ({
        ...previous,
        [name]: "",
      }));
    }

    setStatus("idle");
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.type.trim()) {
      newErrors.type = "Address type is required.";
    }

    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 =
        "Address line 1 is required.";
    }

    if (!formData.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!formData.state.trim()) {
      newErrors.state = "State is required.";
    }

    if (!formData.postalCode.trim()) {
      newErrors.postalCode =
        "Postal code is required.";
    }

    if (!formData.country.trim()) {
      newErrors.country = "Country is required.";
    }

    return newErrors;
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setErrors({});
    setStatus("idle");
    setShowForm(true);
  };

  const openEditForm = (address) => {
    setEditingId(address.id);

    setFormData({
      type: address.type,
      addressLine1: address.addressLine1,
      addressLine2: address.addressLine2,
      city: address.city,
      state: address.state,
      postalCode: address.postalCode,
      country: address.country,
    });

    setErrors({});
    setStatus("idle");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setErrors({});
    setStatus("idle");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("saving");

    try {
      await new Promise((resolve) =>
        setTimeout(resolve, 700)
      );

      if (editingId) {
        setAddresses((previous) =>
          previous.map((address) =>
            address.id === editingId
              ? {
                  ...address,
                  ...formData,
                }
              : address
          )
        );
      } else {
        setAddresses((previous) => [
          ...previous,
          {
            id: Date.now(),
            ...formData,
            selected: previous.length === 0,
          },
        ]);
      }

      setStatus("success");

      setTimeout(() => {
        closeForm();
      }, 700);
    } catch (error) {
      setStatus("error");
    }
  };

  const handleDelete = (id) => {
    const addressToDelete = addresses.find(
      (address) => address.id === id
    );

    if (!addressToDelete) {
      return;
    }

    if (
      !window.confirm(
        "Are you sure you want to remove this address?"
      )
    ) {
      return;
    }

    setAddresses((previous) => {
      const remaining = previous.filter(
        (address) => address.id !== id
      );

      /*
       * If the selected address was removed,
       * select the first remaining address.
       */

      if (
        addressToDelete.selected &&
        remaining.length > 0
      ) {
        remaining[0].selected = true;
      }

      return remaining;
    });
  };

  const handleSelect = (id) => {
    setAddresses((previous) =>
      previous.map((address) => ({
        ...address,
        selected: address.id === id,
      }))
    );
  };

  return (
    <>
      <Navbar />

      <main className="address-management-page">

        <div className="address-management-container">

          {/* HEADER */}

          <div className="address-management-header">

            <div>

              <span className="address-badge">
                PROFILE
              </span>

              <h1>
                Address Management
              </h1>

              <p>
                Manage your saved addresses and select
                the applicable address.
              </p>

            </div>

            <button
              type="button"
              className="address-back-button"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              ← Dashboard
            </button>

          </div>


          {/* ADDRESS LIST */}

          <section className="address-card">

            <div className="address-card-header">

              <div>

                <h2>
                  Your addresses
                </h2>

                <p>
                  Add, edit, remove or select an address.
                </p>

              </div>

              <button
                type="button"
                className="address-add-button"
                onClick={openAddForm}
              >
                + Add Address
              </button>

            </div>


            {addresses.length === 0 ? (

              <div className="address-empty-state">

                <div className="address-empty-icon">
                  +
                </div>

                <h3>
                  No addresses saved
                </h3>

                <p>
                  Add an address to your profile.
                </p>

                <button
                  type="button"
                  onClick={openAddForm}
                >
                  Add Address
                </button>

              </div>

            ) : (

              <div className="address-list">

                {addresses.map((address) => (

                  <div
                    className={
                      address.selected
                        ? "address-item selected"
                        : "address-item"
                    }
                    key={address.id}
                  >

                    {/* SELECT */}

                    <div className="address-select">

                      <input
                        type="radio"
                        name="selectedAddress"
                        checked={address.selected}
                        onChange={() =>
                          handleSelect(address.id)
                        }
                        aria-label={`Select ${address.type} address`}
                      />

                    </div>


                    {/* DETAILS */}

                    <div className="address-details">

                      <div className="address-title-row">

                        <h3>
                          {address.type}
                        </h3>

                        {address.selected && (
                          <span className="address-selected-badge">
                            Selected
                          </span>
                        )}

                      </div>

                      <p>
                        {address.addressLine1}
                      </p>

                      {address.addressLine2 && (
                        <p>
                          {address.addressLine2}
                        </p>
                      )}

                      <p>
                        {address.city},{" "}
                        {address.state}{" "}
                        {address.postalCode}
                      </p>

                      <p>
                        {address.country}
                      </p>

                    </div>


                    {/* ACTIONS */}

                    <div className="address-actions">

                      <button
                        type="button"
                        onClick={() =>
                          openEditForm(address)
                        }
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        className="address-delete-button"
                        onClick={() =>
                          handleDelete(address.id)
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


          {/* ADD / EDIT FORM */}

          {showForm && (

            <section className="address-form-card">

              <div className="address-form-header">

                <div>

                  <span className="address-badge">
                    {editingId
                      ? "EDIT ADDRESS"
                      : "NEW ADDRESS"}
                  </span>

                  <h2>
                    {editingId
                      ? "Edit address"
                      : "Add address"}
                  </h2>

                </div>

                <button
                  type="button"
                  className="address-close-button"
                  onClick={closeForm}
                >
                  ×
                </button>

              </div>


              <form
                className="address-form"
                onSubmit={handleSubmit}
                noValidate
              >

                {/* TYPE */}

                <div className="address-field">

                  <label htmlFor="type">
                    Address Type *
                  </label>

                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                  >
                    <option value="Home">
                      Home
                    </option>

                    <option value="Work">
                      Work
                    </option>

                    <option value="Other">
                      Other
                    </option>
                  </select>

                  {errors.type && (
                    <span className="address-error">
                      {errors.type}
                    </span>
                  )}

                </div>


                {/* ADDRESS LINE 1 */}

                <div className="address-field">

                  <label htmlFor="addressLine1">
                    Address Line 1 *
                  </label>

                  <input
                    id="addressLine1"
                    name="addressLine1"
                    type="text"
                    value={formData.addressLine1}
                    onChange={handleChange}
                    placeholder="House / building / street"
                  />

                  {errors.addressLine1 && (
                    <span className="address-error">
                      {errors.addressLine1}
                    </span>
                  )}

                </div>


                {/* ADDRESS LINE 2 */}

                <div className="address-field">

                  <label htmlFor="addressLine2">
                    Address Line 2
                  </label>

                  <input
                    id="addressLine2"
                    name="addressLine2"
                    type="text"
                    value={formData.addressLine2}
                    onChange={handleChange}
                    placeholder="Apartment / landmark"
                  />

                </div>


                {/* CITY */}

                <div className="address-field">

                  <label htmlFor="city">
                    City *
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                  />

                  {errors.city && (
                    <span className="address-error">
                      {errors.city}
                    </span>
                  )}

                </div>


                {/* STATE */}

                <div className="address-field">

                  <label htmlFor="state">
                    State *
                  </label>

                  <input
                    id="state"
                    name="state"
                    type="text"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                  />

                  {errors.state && (
                    <span className="address-error">
                      {errors.state}
                    </span>
                  )}

                </div>


                {/* POSTAL CODE */}

                <div className="address-field">

                  <label htmlFor="postalCode">
                    Postal Code *
                  </label>

                  <input
                    id="postalCode"
                    name="postalCode"
                    type="text"
                    value={formData.postalCode}
                    onChange={handleChange}
                    placeholder="Enter postal code"
                  />

                  {errors.postalCode && (
                    <span className="address-error">
                      {errors.postalCode}
                    </span>
                  )}

                </div>


                {/* COUNTRY */}

                <div className="address-field">

                  <label htmlFor="country">
                    Country *
                  </label>

                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Enter country"
                  />

                  {errors.country && (
                    <span className="address-error">
                      {errors.country}
                    </span>
                  )}

                </div>


                {status === "error" && (

                  <div className="address-server-error">

                    Unable to save the address.
                    Please try again.

                  </div>

                )}


                {status === "success" && (

                  <div className="address-success">

                    ✓ Address saved successfully.

                  </div>

                )}


                <div className="address-form-actions">

                  <button
                    type="button"
                    className="address-cancel-button"
                    onClick={closeForm}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="address-save-button"
                    disabled={status === "saving"}
                  >
                    {status === "saving"
                      ? "Saving..."
                      : editingId
                      ? "Save Changes"
                      : "Add Address"}
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

export default AddressManagement;