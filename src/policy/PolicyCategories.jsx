import { useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "../components/Footer";
import { usePolicies } from "./PolicyContext";

function PolicyCategories() {
  const { id } = useParams();

  const {
    getPolicy,
    updatePolicy,
  } = usePolicies();

  const policy = getPolicy(id);

  const categories = [
    "Health",
    "Motor",
    "Life",
    "Property",
    "Travel",
    "Other",
  ];

  const [selectedCategory, setSelectedCategory] =
    useState(
      policy?.category || ""
    );

  const [saved, setSaved] =
    useState(false);

  if (!policy) {
    return (
      <div className="policy-empty-page">
        Policy not found.
      </div>
    );
  }

  const handleSave = () => {
    updatePolicy(id, {
      category: selectedCategory,
    });

    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <>
      

      <main className="policy-page">

        <div className="policy-container">

          <div className="policy-header">

            <div>

              <span className="policy-badge">
                POL-06
              </span>

              <h1>
                Policy Category
              </h1>

              <p>
                Assign or change the policy category.
              </p>

            </div>

          </div>


          <section className="policy-card">

            <div className="policy-form">

              <div className="policy-category-current">

                <span>
                  Policy
                </span>

                <strong>
                  {policy.policyNumber}
                </strong>

              </div>


              <div className="category-option-grid">

                {categories.map(
                  (category) => (

                    <button
                      type="button"
                      key={category}
                      className={
                        selectedCategory ===
                        category
                          ? "category-option selected"
                          : "category-option"
                      }
                      onClick={() =>
                        setSelectedCategory(
                          category
                        )
                      }
                    >
                      {category}
                    </button>

                  )
                )}

              </div>


              {saved && (

                <div className="policy-success">

                  ✓ Category saved successfully.

                </div>

              )}


              <div className="policy-actions">

                <button
                  className="policy-save-button"
                  onClick={handleSave}
                >
                  Save Category
                </button>

              </div>

            </div>

          </section>

        </div>

      </main>

      <Footer />
    </>
  );
}

export default PolicyCategories;