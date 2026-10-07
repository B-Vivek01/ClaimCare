import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { onAuthStateChanged, signOut } from "../backend/auth";
import { doc, getDoc } from "../backend/profiles";

import { auth, db } from "../firebase/firebase";

function AdminPortal() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        const snap = await getDoc(doc(db, "customers", user.uid));

        if (!snap.exists()) {
          navigate("/dashboard", { replace: true });
          return;
        }

        const data = snap.data();

        if (data.role !== "admin") {
          navigate("/dashboard", { replace: true });
          return;
        }

        setAdmin(data);
      } catch (error) {
        console.error(error);
        navigate("/dashboard", { replace: true });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main
          style={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h2>Loading Admin Portal...</h2>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="admin-page">
        <div className="admin-container">
          {/* Header */}

          <header className="admin-header">
            <div>
              <span className="admin-badge">ADMINISTRATION</span>

              <h1>Welcome, {admin?.name}</h1>

              <p>Manage customers, operations and the ClaimCare platform.</p>
            </div>

            <button className="admin-logout" onClick={handleLogout}>
              Logout
            </button>
          </header>

          {/* Statistics */}

          <section className="admin-grid">
            <div className="admin-card">
              <span>Total Customers</span>
              <h2>1,245</h2>
              <small>Registered users</small>
            </div>

            <div className="admin-card">
              <span>Active Claims</span>
              <h2>286</h2>
              <small>Currently processing</small>
            </div>

            <div className="admin-card">
              <span>Operations Staff</span>
              <h2>18</h2>
              <small>Active employees</small>
            </div>

            <div className="admin-card">
              <span>Pending Approvals</span>
              <h2>12</h2>
              <small>Require admin action</small>
            </div>
          </section>

          {/* Management */}

          <section className="admin-section">
            <h2>Management Modules</h2>

            <div className="admin-module-grid">
              <div
                className="admin-module"
                onClick={() => navigate("/customers")}
              >
                <div className="icon">👥</div>
                <h3>Customer Management</h3>
                <p>View and manage all registered customers.</p>
              </div>

              <div
                className="admin-module"
                onClick={() => navigate("/employees")}
              >
                <div className="icon">🧑‍💼</div>
                <h3>Employee Management</h3>
                <p>Manage Operations and Admin accounts.</p>
              </div>

              <div
                className="admin-module"
                onClick={() => navigate("/policies")}
              >
                <div className="icon">📋</div>
                <h3>Policy Management</h3>
                <p>Create, update and monitor insurance policies.</p>
              </div>

              <div
                className="admin-module"
                onClick={() => navigate("/claims")}
              >
                <div className="icon">📝</div>
                <h3>Claims Management</h3>
                <p>Approve, reject and review claim requests.</p>
              </div>

              <div
                className="admin-module"
                onClick={() => navigate("/reports")}
              >
                <div className="icon">📊</div>
                <h3>Reports & Analytics</h3>
                <p>Generate business and financial reports.</p>
              </div>

              <div
                className="admin-module"
                onClick={() => navigate("/settings")}
              >
                <div className="icon">⚙️</div>
                <h3>System Settings</h3>
                <p>Configure application settings and permissions.</p>
              </div>
            </div>
          </section>

          {/* Recent Activity */}

          <section className="admin-section">
            <h2>Recent Administrative Activity</h2>

            <div className="activity-list">
              <div className="activity-item">
                <strong>New customer registered</strong>
                <span>2 minutes ago</span>
              </div>

              <div className="activity-item">
                <strong>Policy updated by Operations</strong>
                <span>18 minutes ago</span>
              </div>

              <div className="activity-item">
                <strong>Claim approved</strong>
                <span>45 minutes ago</span>
              </div>

              <div className="activity-item">
                <strong>Employee account created</strong>
                <span>Today</span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default AdminPortal;