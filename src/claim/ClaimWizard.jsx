import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useClaims } from "./ClaimContext";

const steps = [
  "Claim Information",
  "Incident",
  "Notes",
  "Review",
];

const templates = [
  {
    name: "Hospitalization",
    category: "Health",
    description:
      "For hospital and medical treatment claims.",
  },

  {
    name: "Vehicle Accident",
    category: "Motor",
    description:
      "For vehicle accident-related claims.",
  },

  {
    name: "Property Damage",
    category: "Property",
    description:
      "For property damage incidents.",
  },

  {
    name: "Travel Incident",
    category: "Travel",
    description:
      "For travel-related insurance incidents.",
  },
];

function ClaimWizard() {
  const navigate = useNavigate();

  const [
    searchParams,
  ] = useSearchParams();

  const draftId =
    searchParams.get("draft");

  const {
    getClaim,
    createClaim,
    updateClaim,
  } = useClaims();

  const draft = draftId
    ? getClaim(draftId)
    : null;

  const [step, setStep] =
    useState(0);

  const [formData, setFormData] =
    useState({
      policyNumber:
        draft?.policyNumber || "",

      category:
        draft?.category || "",

      template:
        draft?.template || "",

      incidentDate:
        draft?.incidentDate || "",

      incidentType:
        draft?.incidentType || "",

      incidentLocation:
        draft?.incidentLocation || "",

      incidentDescription:
        draft?.incidentDescription || "",

      notes:
        draft?.notes || "",
    });

  const [errors, setErrors] =
    useState({});

  const [saving, setSaving] =
    useState(false);

  const [saved, setSaved] =
    useState(false);

  const selectedTemplate =
    useMemo(
      () =>
        templates.find(
          (template) =>
            template.name ===
            formData.template
        ),
      [formData.template]
    );

  useEffect(() => {
    if (!draft) {
      return;
    }

    setStep(
      draft.wizardStep || 0
    );
  }, [draft]);

  const handleChange = (
    event
  ) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const selectTemplate = (
    template
  ) => {
    setFormData((previous) => ({
      ...previous,

      template:
        template.name,

      category:
        template.category,

      incidentType:
        template.name,
    }));
  };

  const validateStep = () => {
    const newErrors = {};

    if (step === 0) {
      if (
        !formData.policyNumber.trim()
      ) {
        newErrors.policyNumber =
          "Policy number is required.";
      }

      if (!formData.category) {
        newErrors.category =
          "Claim category is required.";
      }

      if (!formData.template) {
        newErrors.template =
          "Select a claim template.";
      }
    }

    if (step === 1) {
      if (!formData.incidentDate) {
        newErrors.incidentDate =
          "Incident date is required.";
      }

      if (
        !formData.incidentLocation.trim()
      ) {
        newErrors.incidentLocation =
          "Incident location is required.";
      }

      if (
        !formData.incidentDescription.trim()
      ) {
        newErrors.incidentDescription =
          "Incident description is required.";
      }
    }

    setErrors(newErrors);

    return (
      Object.keys(newErrors)
        .length === 0
    );
  };

  const saveDraft = () => {
    setSaving(true);

    const data = {
      ...formData,

      status: "Draft",

      wizardStep: step,

      progress: Math.round(
        (step /
          steps.length) *
          100
      ),

      expectedNextStep:
        "Continue completing the claim.",
    };

    if (draft) {
      updateClaim(
        draft.id,
        data
      );
    } else {
      const created =
        createClaim(data);

      navigate(
        `/claims/new?draft=${created.id}`,
        {
          replace: true,
        }
      );
    }

    setTimeout(() => {
      setSaving(false);
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2000);
    }, 500);
  };

  const nextStep = () => {
    if (!validateStep()) {
      return;
    }

    if (step < steps.length - 1) {
      setStep(
        (previous) =>
          previous + 1
      );

      return;
    }
  };

  const previousStep = () => {
    if (step > 0) {
      setStep(
        (previous) =>
          previous - 1
      );
    }
  };

  const submitClaim = () => {
    if (!validateStep()) {
      return;
    }

    if (!draft) {
      const claim =
        createClaim({
          ...formData,

          status: "Submitted",

          progress: 100,

          expectedNextStep:
            "Claim submitted. Wait for review.",

          timeline: [
            {
              date: new Date()
                .toISOString()
                .split("T")[0],

              title:
                "Claim Submitted",

              description:
                "Claim was submitted for review.",
            },
          ],
        });

      navigate(
        `/claims/${claim.id}`
      );

      return;
    }

    updateClaim(
      draft.id,
      {
        ...formData,

        status: "Submitted",

        progress: 100,

        expectedNextStep:
          "Claim submitted. Wait for review.",

        timeline: [
          ...(draft.timeline || []),

          {
            date: new Date()
              .toISOString()
              .split("T")[0],

            title:
              "Claim Submitted",

            description:
              "Claim was submitted for review.",
          },
        ],
      }
    );

    navigate(
      `/claims/${draft.id}`
    );
  };

  return (
    <>

      <main className="claim-wizard-page">

        <div className="claim-container">

          {/* HEADER */}

          <div className="claim-header">

            <div>

              <span className="claim-badge">
                CLAIM MANAGEMENT
              </span>

              <h1>
                {draft
                  ? "Resume Claim"
                  : "Start New Claim"}
              </h1>

              <p>
                Complete each step and review
                your claim before submission.
              </p>

            </div>

            <button
              className="claim-secondary-button"
              onClick={() =>
                navigate("/claims")
              }
            >
              ← Claims
            </button>

          </div>


          {/* PROGRESS */}

          <div className="claim-wizard-progress">

            {steps.map(
              (
                item,
                index
              ) => (

                <div
                  key={item}
                  className={
                    index === step
                      ? "claim-step active"
                      : index < step
                      ? "claim-step completed"
                      : "claim-step"
                  }
                >

                  <div>
                    {index < step
                      ? "✓"
                      : index + 1}
                  </div>

                  <span>
                    {item}
                  </span>

                </div>

              )
            )}

          </div>


          {/* FORM */}

          <section className="claim-form-card">

            {step === 0 && (

              <ClaimInformation
                formData={formData}
                errors={errors}
                handleChange={
                  handleChange
                }
                selectTemplate={
                  selectTemplate
                }
                selectedTemplate={
                  selectedTemplate
                }
              />

            )}


            {step === 1 && (

              <IncidentInformation
                formData={formData}
                errors={errors}
                handleChange={
                  handleChange
                }
              />

            )}


            {step === 2 && (

              <NotesStep
                formData={formData}
                handleChange={
                  handleChange
                }
              />

            )}


            {step === 3 && (

              <ReviewStep
                formData={formData}
              />

            )}


            {/* SAVED STATE */}

            {saved && (

              <div className="claim-success">
                ✓ Draft saved successfully.
              </div>

            )}


            {/* ACTIONS */}

            <div className="claim-wizard-actions">

              <button
                className="claim-secondary-button"
                onClick={
                  previousStep
                }
                disabled={
                  step === 0
                }
              >
                ← Previous
              </button>

              <button
                className="claim-secondary-button"
                onClick={saveDraft}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : "Save Draft"}
              </button>

              {step <
              steps.length - 1 ? (

                <button
                  className="claim-primary-button"
                  onClick={nextStep}
                >
                  Next →
                </button>

              ) : (

                <button
                  className="claim-primary-button"
                  onClick={submitClaim}
                >
                  Submit Claim
                </button>

              )}

            </div>

          </section>

        </div>

      </main>

      <Footer />
    </>
  );
}


function ClaimInformation({
  formData,
  errors,
  handleChange,
  selectTemplate,
  selectedTemplate,
}) {
  return (
    <div>

      <div className="claim-section-heading">

        <span>
          STEP 1
        </span>

        <h2>
          Claim Information
        </h2>

        <p>
          Select the policy and claim type.
        </p>

      </div>


      <div className="claim-form-grid">

        <div className="claim-field">

          <label>
            Policy Number *
          </label>

          <input
            name="policyNumber"
            value={
              formData.policyNumber
            }
            onChange={
              handleChange
            }
            placeholder="Enter policy number"
          />

          {errors.policyNumber && (
            <small>
              {
                errors.policyNumber
              }
            </small>
          )}

        </div>


        <div className="claim-field">

          <label>
            Claim Category *
          </label>

          <select
            name="category"
            value={
              formData.category
            }
            onChange={
              handleChange
            }
          >

            <option value="">
              Select category
            </option>

            <option value="Health">
              Health
            </option>

            <option value="Motor">
              Motor
            </option>

            <option value="Property">
              Property
            </option>

            <option value="Travel">
              Travel
            </option>

            <option value="Other">
              Other
            </option>

          </select>

          {errors.category && (
            <small>
              {errors.category}
            </small>
          )}

        </div>

      </div>


      <div className="claim-template-section">

        <div className="claim-section-heading">

          <span>
            CLM-06
          </span>

          <h3>
            Choose Claim Template
          </h3>

        </div>


        <div className="claim-template-grid">

          {templates.map(
            (template) => (

              <button
                type="button"
                key={template.name}
                className={
                  formData.template ===
                  template.name
                    ? "claim-template selected"
                    : "claim-template"
                }
                onClick={() =>
                  selectTemplate(
                    template
                  )
                }
              >

                <strong>
                  {template.name}
                </strong>

                <span>
                  {template.description}
                </span>

                <small>
                  {template.category}
                </small>

              </button>

            )
          )}

        </div>

        {errors.template && (
          <div className="claim-field-error">
            {errors.template}
          </div>
        )}

      </div>


      {selectedTemplate && (

        <div className="claim-template-selected">

          Selected:
          {" "}
          <strong>
            {selectedTemplate.name}
          </strong>

        </div>

      )}

    </div>
  );
}


function IncidentInformation({
  formData,
  errors,
  handleChange,
}) {
  return (
    <div>

      <div className="claim-section-heading">

        <span>
          STEP 2
        </span>

        <h2>
          Incident Information
        </h2>

        <p>
          Tell us what happened.
        </p>

      </div>


      <div className="claim-form-grid">

        <div className="claim-field">

          <label>
            Incident Date *
          </label>

          <input
            type="date"
            name="incidentDate"
            value={
              formData.incidentDate
            }
            onChange={
              handleChange
            }
          />

          {errors.incidentDate && (
            <small>
              {
                errors.incidentDate
              }
            </small>
          )}

        </div>


        <div className="claim-field">

          <label>
            Incident Type
          </label>

          <input
            name="incidentType"
            value={
              formData.incidentType
            }
            onChange={
              handleChange
            }
          />

        </div>


        <div className="claim-field">

          <label>
            Incident Location *
          </label>

          <input
            name="incidentLocation"
            value={
              formData.incidentLocation
            }
            onChange={
              handleChange
            }
            placeholder="City / Location"
          />

          {errors.incidentLocation && (
            <small>
              {
                errors.incidentLocation
              }
            </small>
          )}

        </div>

      </div>


      <div className="claim-field claim-full-field">

        <label>
          What happened? *
        </label>

        <textarea
          name="incidentDescription"
          value={
            formData.incidentDescription
          }
          onChange={
            handleChange
          }
          rows="6"
          placeholder="Describe the incident..."
        />

        {errors.incidentDescription && (
          <small>
            {
              errors.incidentDescription
            }
          </small>
        )}

      </div>

    </div>
  );
}


function NotesStep({
  formData,
  handleChange,
}) {
  return (
    <div>

      <div className="claim-section-heading">

        <span>
          STEP 3
        </span>

        <h2>
          Supporting Notes
        </h2>

        <p>
          Add any information that may help
          with the claim.
        </p>

      </div>


      <div className="claim-field claim-full-field">

        <label>
          Supporting Notes
        </label>

        <textarea
          name="notes"
          value={
            formData.notes
          }
          onChange={
            handleChange
          }
          rows="9"
          placeholder="Enter supporting information..."
        />

      </div>

    </div>
  );
}


function ReviewStep({
  formData,
}) {
  return (
    <div>

      <div className="claim-section-heading">

        <span>
          STEP 4
        </span>

        <h2>
          Review & Submit
        </h2>

        <p>
          Verify the information before submitting.
        </p>

      </div>


      <div className="claim-review-grid">

        <ReviewItem
          label="Policy Number"
          value={
            formData.policyNumber
          }
        />

        <ReviewItem
          label="Category"
          value={
            formData.category
          }
        />

        <ReviewItem
          label="Template"
          value={
            formData.template
          }
        />

        <ReviewItem
          label="Incident Date"
          value={
            formData.incidentDate
          }
        />

        <ReviewItem
          label="Incident Type"
          value={
            formData.incidentType
          }
        />

        <ReviewItem
          label="Location"
          value={
            formData.incidentLocation
          }
        />

      </div>


      <div className="claim-review-description">

        <span>
          Incident Description
        </span>

        <p>
          {
            formData.incidentDescription ||
            "No description provided."
          }
        </p>

      </div>


      <div className="claim-review-description">

        <span>
          Supporting Notes
        </span>

        <p>
          {
            formData.notes ||
            "No supporting notes provided."
          }
        </p>

      </div>

    </div>
  );
}


function ReviewItem({
  label,
  value,
}) {
  return (
    <div className="claim-review-item">

      <span>
        {label}
      </span>

      <strong>
        {value || "—"}
      </strong>

    </div>
  );
}

export default ClaimWizard;