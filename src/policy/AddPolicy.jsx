import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { usePolicies } from "./PolicyContext";

function AddPolicy() {
  const navigate = useNavigate();

  const { addPolicy } = usePolicies();

  const [formData, setFormData] = useState({
    policyNumber: "",
    policyHolderName: "",
    policyType: "",
    provider: "",
    category: "",
    startDate: "",
    endDate: "",
    premiumAmount: "",
    coverageAmount: "",
    status: "Active",
    renewalReminder: true,
    reminderDays: 30,
  });

  const [errors, setErrors] = useState({});

  const [saving, setSaving] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setFormData((previous) => ({
      ...previous,

      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.policyNumber.trim()) {
      newErrors.policyNumber =
        "Policy number is required.";
    }

    if (!formData.policyHolderName.trim()) {
      newErrors.policyHolderName =
        "Policy holder name is required.";
    }

    if (!formData.policyType) {
      newErrors.policyType =
        "Policy type is required.";
    }

    if (!formData.provider.trim()) {
      newErrors.provider =
        "Provider is required.";
    }

    if (!formData.category) {
      newErrors.category =
        "Category is required.";
    }

    if (!formData.startDate) {
      newErrors.startDate =
        "Start date is required.";
    }

    if (!formData.endDate) {
      newErrors.endDate =
        "End date is required.";
    }

    if (
      formData.startDate &&
      formData.endDate &&
      formData.endDate <
        formData.startDate
    ) {
      newErrors.endDate =
        "End date cannot be before start date.";
    }

    if (
      !formData.premiumAmount ||
      Number(formData.premiumAmount) <= 0
    ) {
      newErrors.premiumAmount =
        "Enter a valid premium amount.";
    }

    if (
      !formData.coverageAmount ||
      Number(formData.coverageAmount) <= 0
    ) {
      newErrors.coverageAmount =
        "Enter a valid coverage amount.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    setSaving(true);

    await new Promise((resolve) =>
      setTimeout(resolve, 700)
    );

    const newPolicy = addPolicy({
      ...formData,
      premiumAmount: Number(
        formData.premiumAmount
      ),
      coverageAmount: Number(
        formData.coverageAmount
      ),
    });

    setSaving(false);
    setSuccess(true);

    setTimeout(() => {
      navigate(`/policies/${newPolicy.id}`);
    }, 800);
  };

  return (
    <>
      

      <main className="policy-page">

        <div className="policy-container">

          <div className="policy-header">

            <div>

              <span className="policy-badge">
                POLICY MANAGEMENT
              </span>

              <h1>
                Add Policy
              </h1>

              <p>
                Create a new policy record.
              </p>

            </div>

            <button
              className="policy-back-button"
              onClick={() =>
                navigate("/policies")
              }
            >
              ← Policies
            </button>

          </div>


          <section className="policy-card">

            <div className="policy-card-header">

              <div className="policy-card-icon">
                +
              </div>

              <div>

                <h2>
                  Policy Information
                </h2>

                <p>
                  Enter the policy details below.
                </p>

              </div>

            </div>


            <form
              className="policy-form"
              onSubmit={handleSubmit}
            >

              <div className="policy-grid">

                <PolicyInput
                  label="Policy Number"
                  name="policyNumber"
                  value={
                    formData.policyNumber
                  }
                  onChange={handleChange}
                  error={
                    errors.policyNumber
                  }
                />

                <PolicyInput
                  label="Policy Holder Name"
                  name="policyHolderName"
                  value={
                    formData.policyHolderName
                  }
                  onChange={handleChange}
                  error={
                    errors.policyHolderName
                  }
                />

                <PolicySelect
                  label="Policy Type"
                  name="policyType"
                  value={
                    formData.policyType
                  }
                  onChange={handleChange}
                  error={
                    errors.policyType
                  }
                  options={[
                    "Health",
                    "Motor",
                    "Life",
                    "Property",
                    "Travel",
                    "Other",
                  ]}
                />

                <PolicyInput
                  label="Insurance Provider"
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                  error={errors.provider}
                />

                <PolicySelect
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  error={errors.category}
                  options={[
                    "Health",
                    "Motor",
                    "Life",
                    "Property",
                    "Travel",
                    "Other",
                  ]}
                />

                <PolicyInput
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={
                    formData.startDate
                  }
                  onChange={handleChange}
                  error={errors.startDate}
                />

                <PolicyInput
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  error={errors.endDate}
                />

                <PolicyInput
                  label="Premium Amount"
                  name="premiumAmount"
                  type="number"
                  value={
                    formData.premiumAmount
                  }
                  onChange={handleChange}
                  error={
                    errors.premiumAmount
                  }
                />

                <PolicyInput
                  label="Coverage Amount"
                  name="coverageAmount"
                  type="number"
                  value={
                    formData.coverageAmount
                  }
                  onChange={handleChange}
                  error={
                    errors.coverageAmount
                  }
                />

                <PolicySelect
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={[
                    "Active",
                    "Pending",
                    "Inactive",
                  ]}
                />

              </div>


              <div className="policy-checkbox-row">

                <input
                  type="checkbox"
                  id="renewalReminder"
                  name="renewalReminder"
                  checked={
                    formData.renewalReminder
                  }
                  onChange={handleChange}
                />

                <label htmlFor="renewalReminder">
                  Enable renewal reminder
                </label>

              </div>


              {success && (

                <div className="policy-success">

                  ✓ Policy created successfully.

                </div>

              )}


              <div className="policy-actions">

                <button
                  type="button"
                  className="policy-reset-button"
                  onClick={() =>
                    navigate("/policies")
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="policy-save-button"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : "Save Policy"}
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


function PolicyInput({
  label,
  name,
  value,
  onChange,
  error,
  type = "text",
}) {
  return (
    <div className="policy-field">

      <label htmlFor={name}>
        {label}
      </label>

      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
      />

      {error && (
        <small>
          {error}
        </small>
      )}

    </div>
  );
}


function PolicySelect({
  label,
  name,
  value,
  onChange,
  error,
  options,
}) {
  return (
    <div className="policy-field">

      <label htmlFor={name}>
        {label}
      </label>

      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
      >

        <option value="">
          Select {label}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

      {error && (
        <small>
          {error}
        </small>
      )}

    </div>
  );
}

export default AddPolicy;