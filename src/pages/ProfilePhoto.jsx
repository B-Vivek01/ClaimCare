import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

import { auth, db } from "../firebase/firebase";

function ProfilePhoto() {
  const navigate = useNavigate();

  const [customerName, setCustomerName] = useState("Customer");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        const customerRef = doc(db, "customers", user.uid);
        const customerSnap = await getDoc(customerRef);

        if (customerSnap.exists()) {
          const data = customerSnap.data();
          setCustomerName(data.name || "Customer");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const customerInitial =
    customerName.charAt(0).toUpperCase() || "C";

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="profile-photo-page">
          <div className="profile-photo-container">
            <h2>Loading...</h2>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>

      <main className="profile-photo-page">
        <div className="profile-photo-container">

          {/* HEADER */}

          <div className="profile-photo-header">

            <div>

              <span className="profile-photo-badge">
                PROFILE
              </span>

              <h1>Profile Avatar</h1>

              <p>
                Your avatar is automatically generated from your registered name.
              </p>

            </div>

            <button
              type="button"
              className="profile-photo-back-button"
              onClick={() => navigate("/dashboard")}
            >
              ← Dashboard
            </button>

          </div>

          {/* CARD */}

          <section className="profile-photo-card">

            <div className="profile-photo-card-header">

              <div>

                <h2>Your Profile Avatar</h2>

                <p>
                  This avatar is created from the first letter of your registered name.
                </p>

              </div>

            </div>

            <div className="profile-photo-content">

              <div className="profile-photo-preview-section">

                <div className="profile-photo-preview">

                  <span>{customerInitial}</span>

                </div>

                <h3>{customerName}</h3>

                <p className="profile-photo-preview-label">
                  Registered Customer
                </p>

              </div>

            </div>

          </section>

          {/* INFO */}

          <section className="profile-photo-info">

            <div className="profile-photo-info-icon">
              i
            </div>

            <div>

              <strong>How it works</strong>

              <p>
                The avatar always uses the first letter of the name entered during registration.
                Every customer gets a unique initial automatically.
              </p>

            </div>

          </section>

        </div>
      </main>

      <Footer />
    </>
  );
}

export default ProfilePhoto;