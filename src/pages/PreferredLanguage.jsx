import { useAuth } from "../auth/AuthContext";
import { updateDoc } from "../backend/profiles";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

function PreferredLanguage() {
  const navigate = useNavigate();
  const {user,profile} = useAuth();

  const [language, setLanguage] = useState(profile?.preferredLanguage || "English");
  const [savedLanguage, setSavedLanguage] = useState(profile?.preferredLanguage || "English");
  const [status, setStatus] = useState("idle");

  const handleChange = (event) => {
    setLanguage(event.target.value);
    setStatus("idle");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (language === savedLanguage) {
      setStatus("unchanged");
      return;
    }

    setStatus("saving");

    try {
      await updateDoc({id:user.uid},{preferredLanguage:language});

      setSavedLanguage(language);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return (
    <>

      <main className="preferred-language-page">

        <div className="preferred-language-container">

          {/* HEADER */}

          <div className="preferred-language-header">

            <div>

              <span className="language-badge">
                PROFILE
              </span>

              <h1>
                Preferred Language
              </h1>

              <p>
                Choose the language you prefer to use
                when supported by ClaimCare.
              </p>

            </div>

            <button
              type="button"
              className="language-back-button"
              onClick={() =>
                navigate("/dashboard")
              }
            >
              ← Dashboard
            </button>

          </div>


          {/* CARD */}

          <section className="preferred-language-card">

            <div className="preferred-language-card-header">

              <div className="language-icon">
                A
              </div>

              <div>

                <h2>
                  Language preference
                </h2>

                <p>
                  Your selected language will be used
                  wherever language support is available.
                </p>

              </div>

            </div>


            <form
              className="preferred-language-form"
              onSubmit={handleSave}
            >

              <div className="language-field">

                <label htmlFor="preferredLanguage">
                  Preferred Language
                </label>

                <select
                  id="preferredLanguage"
                  value={language}
                  onChange={handleChange}
                >
                  <option value="English">
                    English
                  </option>

                  <option value="Hindi">
                    Hindi
                  </option>

                  <option value="Telugu">
                    Telugu
                  </option>

                  <option value="Tamil">
                    Tamil
                  </option>

                  <option value="Kannada">
                    Kannada
                  </option>
                </select>

                <small>
                  Currently, the interface is fully
                  available in English. Additional
                  language support can be applied when
                  enabled.
                </small>

              </div>


              {/* CURRENT VALUE */}

              <div className="language-current">

                <span>
                  Current preference
                </span>

                <strong>
                  {savedLanguage}
                </strong>

              </div>


              {/* SUCCESS */}

              {status === "success" && (

                <div className="language-success">

                  <span>✓</span>

                  <div>

                    <strong>
                      Language preference saved
                    </strong>

                    <p>
                      Your preferred language has been
                      updated to {savedLanguage}.
                    </p>

                  </div>

                </div>

              )}


              {/* UNCHANGED */}

              {status === "unchanged" && (

                <div className="language-info">

                  Your preferred language is already
                  set to {savedLanguage}.

                </div>

              )}


              {/* ERROR */}

              {status === "error" && (

                <div className="language-error">

                  Unable to save your language preference.
                  Please try again.

                </div>

              )}


              {/* ACTION */}

              <div className="language-actions">

                <button
                  type="submit"
                  className="language-save-button"
                  disabled={status === "saving"}
                >
                  {status === "saving"
                    ? "Saving..."
                    : "Save Preference"}
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

export default PreferredLanguage;
