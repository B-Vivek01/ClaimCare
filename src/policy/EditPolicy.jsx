import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { usePolicies } from "./PolicyContext";

function EditPolicy() {
  const { id } = useParams();

  const navigate = useNavigate();

  const {
    getPolicy,
    updatePolicy,
  } = usePolicies();

  const policy = getPolicy(id);

  const [formData, setFormData] =
    useState(null);

  const [errors, setErrors] = useState({});

  const [saving, setSaving] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  useEffect(() => {
    if (policy) {
      setFormData({
        policyNumber:
          policy.policyNumber || "",

        policyHolderName:
          policy.policyHolderName || "",

        policyType:
          policy.policyType || "",

        provider:
          policy.provider || "",

        category:
          policy.category || "",

        startDate:
          policy.startDate || "",

        endDate:
          policy.endDate || "",

        premiumAmount:
          policy.premiumAmount || "",

        coverageAmount:
          policy.coverageAmount || "",

        status:
          policy.status || "Active",
      });
    }
  }, [policy]);

  if (!policy) {
    return (
      <>
      

        <main className="policy-page">

          <div className="policy-empty-page">

            <h1>
              Policy Not Found
            </h1>

            <button
              className="policy-primary-button"
              onClick={() =>
                navigate("/policies")
              }
            >
              Back to Policies
            </button>

          </div>

        </main>

        <Footer />
      </>
    );
  }

  if (!formData) {
    return (
      <div className="policy-loading">
        Loading policy...
      </div>
    );
  }

  const handleChange = (event) => {
    const { name, value } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
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

    if (!formData.provider.trim()) {
      newErrors.provider =
        "Provider is required.";
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
      formData.endDate &&
      formData.startDate &&
      formData.endDate <
        formData.startDate
    ) {
      newErrors.endDate =
        "End date cannot be before start date.";
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



    const saved = await updatePolicy(id, {
      ...formData,

      premiumAmount:
        Number(formData.premiumAmount),

      coverageAmount:
        Number(formData.coverageAmount),
    });

    setSaving(false);
    if (!saved) return;
    setSuccess(true);

    setTimeout(() => {
      navigate(`/policies/${id}`);
    }, 700);
  };

  return (
    <>
      <Navbar />

      <main className="policy-page">

        <div className="policy-container">

          <div className="policy-header">

            <div>

              <span className="policy-badge">
                POLICY MANAGEMENT
              </span>

              <h1>
                Edit Policy
              </h1>

              <p>
                Update policy information.
              </p>

            </div>

            <button
              className="policy-back-button"
              onClick={() =>
                navigate(`/policies/${id}`)
              }
            >
              ← Policy Details
            </button>

          </div>


          <section className="policy-card">

            <div className="policy-card-header">

              <div className="policy-card-icon">
                ✎
              </div>

              <div>

                <h2>
                  {policy.policyNumber}
                </h2>

                <p>
                  Edit the permitted policy
                  information.
                </p>

              </div>

            </div>


            <form
              className="policy-form"
              onSubmit={handleSubmit}
            >

              <div className="policy-grid">

                <EditField
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

                <EditField
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

                <EditSelect
                  label="Policy Type"
                  name="policyType"
                  value={
                    formData.policyType
                  }
                  onChange={handleChange}
                  options={[
                    "Health",
                    "Motor",
                    "Life",
                    "Property",
                    "Travel",
                    "Other",
                  ]}
                />

                <EditField
                  label="Provider"
                  name="provider"
                  value={formData.provider}
                  onChange={handleChange}
                  error={errors.provider}
                />

                <EditSelect
                  label="Category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  options={[
                    "Health",
                    "Motor",
                    "Life",
                    "Property",
                    "Travel",
                    "Other",
                  ]}
                />

                <EditField
                  label="Start Date"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  error={errors.startDate}
                />

                <EditField
                  label="End Date"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={handleChange}
                  error={errors.endDate}
                />

                <EditField
                  label="Premium Amount"
                  name="premiumAmount"
                  type="number"
                  value={
                    formData.premiumAmount
                  }
                  onChange={handleChange}
                />

                <EditField
                  label="Coverage Amount"
                  name="coverageAmount"
                  type="number"
                  value={
                    formData.coverageAmount
                  }
                  onChange={handleChange}
                />

                <EditSelect
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  options={[
                    "Active",
                    "Pending",
                    "Inactive",
                    "Archived",
                  ]}
                />

              </div>


              {success && (

                <div className="policy-success">

                  ✓ Policy updated successfully.

                </div>

              )}


              <div className="policy-actions">

                <button
                  type="button"
                  className="policy-reset-button"
                  onClick={() =>
                    navigate(
                      `/policies/${id}`
                    )
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
                    : "Save Changes"}
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

function EditField({
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

function EditSelect({
  label,
  name,
  value,
  onChange,
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

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}

      </select>

    </div>
  );
}

export default EditPolicy;
