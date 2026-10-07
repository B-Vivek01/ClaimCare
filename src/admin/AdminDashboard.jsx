import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { onAuthStateChanged, signOut } from "../backend/auth";
import { doc, getDoc } from "../backend/profiles";

import { auth, db } from "../backend/session";
import {useProfiles} from "../backend/useProfiles";
import {useClaims} from "../claim/ClaimContext";
import {useTableRows} from "../backend/useTableRows";
import {Link} from "react-router-dom";

function AdminDashboard() {
  const [profiles]=useProfiles();
  const {claims}=useClaims();
  const {rows:events,error:eventError}=useTableRows('audit_events',10);
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
              <h2>{profiles.filter(profile=>profile.role==='customer').length}</h2>
              <small>Registered users</small>
            </div>

            <div className="admin-card">
              <span>Active Claims</span>
              <h2>{claims.filter(claim=>!claim.archived&&!['Draft','Closed','Rejected'].includes(claim.status)).length}</h2>
              <small>Currently processing</small>
            </div>

            <div className="admin-card">
              <span>Operations Staff</span>
              <h2>{profiles.filter(profile=>profile.role==='operations'&&profile.status==='Active').length}</h2>
              <small>Active employees</small>
            </div>

            <div className="admin-card">
              <span>Pending Identity Reviews</span>
              <h2>{profiles.filter(profile=>profile.identityStatus==='pending').length}</h2>
              <small>Require staff review</small>
            </div>
          </section>

          {/* Management */}

          <section className="admin-section">
            <h2>Management Modules</h2>

            <div className="admin-module-grid">
              <div
                className="admin-module"
                onClick={() => navigate("/admin/users")}
              >
                <div className="icon">👥</div>
                <h3>Customer Management</h3>
                <p>View and manage all registered customers.</p>
              </div>

              <div
                className="admin-module"
                onClick={() => navigate("/admin/users")}
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
                onClick={() => navigate("/admin/config")}
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
            <p><Link to="/admin/audit">Audit log</Link> · <Link to="/ops/support">Support inbox</Link> · <Link to="/ops/identity-reviews">Identity reviews</Link> · <Link to="/payments/invoices">Service invoices</Link></p>
            {eventError&&<p role="alert">{eventError}</p>}
            <div className="activity-list">
              {events.map(event=><div className="activity-item" key={event.id}><strong>{event.action} — {event.module} / {event.record_id}</strong><span>{new Date(event.created_at).toLocaleString()}</span></div>)}
              {!events.length&&!eventError&&<p>No recorded activity yet.</p>}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default AdminDashboard;
