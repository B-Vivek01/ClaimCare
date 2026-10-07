import { useClaims } from "../claim/ClaimContext";
import { useNotification } from "../notification/NotificationContext";
import { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { usePolicies } from "../policy/PolicyContext";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { signOut } from "../backend/auth";


import { auth } from "../backend/session";

function CustomerDashboard() {
    const navigate = useNavigate();

    const [profileOpen, setProfileOpen] = useState(false);
    const {claims}=useClaims();
    const {notifications}=useNotification();

    const { user, profile: customer, loading, error: sessionError } = useAuth();
    const { policies } = usePolicies();
    const [actionError, setError] = useState("");
    const error = actionError || sessionError;
    const role = customer?.role || "customer";
    const ownPolicies = policies.filter(policy => policy.ownerId === user?.uid);
    const ownClaims=claims.filter(claim=>claim.ownerId===user?.uid);
    const activeClaims=ownClaims.filter(claim=>!claim.archived && !['Closed','Settled','Rejected'].includes(claim.status));
    const pendingTasks=ownClaims.flatMap(claim=>claim.tasks || []).filter(task=>task.status!=='Completed');
    const unreadNotifications=notifications.filter(item=>item.ownerId===user?.uid && item.status==='Unread');
    const completionFields=[customer?.name,customer?.email,customer?.mobile,customer?.dateOfBirth,customer?.preferredLanguage];
    const completion=Math.round(completionFields.filter(Boolean).length/completionFields.length*100);


    /*
     * ============================================================
     * LOGOUT
     * ============================================================
     */

    const handleLogout = async () => {
        try {
            await signOut(auth);

            navigate("/login", {
                replace: true,
            });
        } catch (logoutError) {
            console.error(
                "Logout error:",
                logoutError
            );

            setError(
                "Unable to logout. Please try again."
            );
        }
    };

    /*
     * ============================================================
     * LOADING SCREEN
     * ============================================================
     */

    if (loading) {
        return (
            <>
                

                <main
                    className="customer-dashboard-page"
                    style={{
                        minHeight: "70vh",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <div
                        style={{
                            textAlign: "center",
                        }}
                    >
                        <h2>
                            Loading Dashboard...
                        </h2>

                        <p>
                            Please wait while we load
                            your account information.
                        </p>
                    </div>
                </main>

                <Footer />
            </>
        );
    }


    const customerName =
        customer?.name?.trim() || "Customer";

    const customerInitial =
        customerName.charAt(0).toUpperCase();

    return (
        <>
            <Navbar />
            <main className="customer-dashboard-page">

                <div className="customer-dashboard-layout">


                    <aside className="customer-sidebar">

                        <div className="customer-sidebar-header">
                            <div className="customer-avatar">
                                {customerInitial}
                            </div>

                            <div>
                                <strong>{customerName}</strong>
                                <span>{customerName}</span>
                            </div>
                        </div>


                        <nav className="customer-navigation">

                            {/* DASHBOARD */}

                            <Link
                                to="/dashboard"
                                className="customer-nav-item active"
                            >
                                <span className="customer-nav-icon">
                                    ⌂
                                </span>

                                Dashboard
                            </Link>

                            {(role === "operations" || role === "admin") && (
                                <Link to="/ops" className="dashboard-feature-content">
                                    <span className="dashboard-feature-icon">⚙️</span>
                                    Operations Portal
                                </Link>
                            )}




                            {/* CLAIMS */}

                            <Link
                                to="/claims"
                                className="customer-nav-item"
                            >
                                <span className="customer-nav-icon">
                                    #
                                </span>

                                My Claims
                            </Link>


                            {/* DOCUMENTS */}

                            <Link
                                to="/documents"
                                className="customer-nav-item"
                            >
                                <span className="customer-nav-icon">
                                    □
                                </span>

                                Document Management
                            </Link>



                            {role === "admin" && (
                                <Link to="/admin" className="dashboard-feature-content">
                                    <span className="dashboard-feature-icon">🛠️</span>
                                    Administration
                                </Link>
                            )}

                            
                                <Link to="/knowledge" className="dashboard-feature-content">
                                    <span className="dashboard-feature-icon">📚</span>
                                    Knowledge Base
                                </Link>
                            


                            <Link to="/communication" className="dashboard-feature-content">
                                <span className="dashboard-feature-icon">💬</span>
                                Communication Center
                            </Link>



                            <Link to="/notifications" className="dashboard-feature-content">
                                <span className="dashboard-feature-icon">🔔</span>
                                Notification Center
                            </Link>

                            <Link
                                to="/reports/customer"
                                className="customer-nav-item"
                            >
                                <span className="customer-nav-icon">
                                    📊
                                </span>

                                Reporting & Analytics

                            </Link>

                            {/* NOTIFICATIONS */}

                            <Link
                                to="/payments"
                                className="customer-nav-item"
                            >
                                <span className="customer-nav-icon">
                                    💳
                                </span>

                                Payment & Billing

                            </Link>


                            <div className="customer-nav-divider" />


                            {/* PROFILE */}

                            <button
                                type="button"
                                className={
                                    profileOpen
                                        ? "customer-nav-item profile-nav-button selected"
                                        : "customer-nav-item profile-nav-button"
                                }
                                onClick={() =>
                                    setProfileOpen(
                                        (previous) =>
                                            !previous
                                    )
                                }
                            >

                                <span className="customer-nav-icon">
                                    ◯
                                </span>

                                <span className="profile-nav-label">
                                    Profile
                                </span>

                                <span className="profile-chevron">
                                    {profileOpen
                                        ? "▲"
                                        : "▼"}
                                </span>

                            </button>


                            {/* PROFILE SUBMENU */}

                            {profileOpen && (

                                <div className="customer-profile-submenu">

                                    <Link
                                        to="/profile/personal-details"
                                        className="customer-profile-link"
                                    >
                                        Personal Details
                                    </Link>

                                    <Link
                                        to="/profile/contact"
                                        className="customer-profile-link"
                                    >
                                        Contact Information
                                    </Link>

                                    <Link
                                        to="/profile/address"
                                        className="customer-profile-link"
                                    >
                                        Address
                                    </Link>

                                    <Link
                                        to="/profile/photo"
                                        className="customer-profile-link"
                                    >
                                        Profile Photo
                                    </Link>

                                    <Link
                                        to="/profile/identity-verification"
                                        className="customer-profile-link"
                                    >
                                        Identity Verification
                                    </Link>

                                    <Link
                                        to="/profile/password"
                                        className="customer-profile-link"
                                    >
                                        Change Password
                                    </Link>

                                    <Link
                                        to="/profile/notifications"
                                        className="customer-profile-link"
                                    >
                                        Notification Settings
                                    </Link>

                                    <Link
                                        to="/profile/emergency-contacts"
                                        className="customer-profile-link"
                                    >
                                        Emergency Contacts
                                    </Link>

                                    <Link
                                        to="/profile/preferences/language"
                                        className="customer-profile-link"
                                    >
                                        Preferred Language
                                    </Link>

                                </div>

                            )}


                            {/* SETTINGS */}

                            <Link
                                to="/settings"
                                className="customer-nav-item"
                            >
                                <span className="customer-nav-icon">
                                    ⚙
                                </span>

                                Settings
                            </Link>

                        </nav>


                        {/* LOGOUT */}

                        <div className="customer-sidebar-footer">

                            <button
                                type="button"
                                className="customer-logout"
                                onClick={handleLogout}
                            >
                                <span>
                                    ↪
                                </span>

                                Logout
                            </button>

                        </div>

                    </aside>


                    {/* =====================================
              MAIN CONTENT
          ===================================== */}

                    <section className="customer-dashboard-content">

                        {/* FIREBASE ERROR */}

                        {error && (
                            <div
                                className="register-server-error"
                                style={{
                                    marginBottom: "20px",
                                }}
                            >
                                <strong>
                                    Unable to load account
                                </strong>

                                <p>
                                    {error}
                                </p>
                            </div>
                        )}

                        {/* HEADER */}

                        <header className="customer-dashboard-header">

                            <div>

                                <span className="dashboard-label">
                                    CUSTOMER DASHBOARD
                                </span>

                                <h1>
                                    Welcome back,{" "}
                                    {customerName}
                                </h1>

                                <p>
                                    Here's an overview of your ClaimCare
                                    activity.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="dashboard-profile-button"
                                onClick={() => navigate("/profile/photo")}
                            >

                                <span className="dashboard-small-avatar">
                                    {customerInitial}
                                </span>


                                Profile
                            </button>

                        </header>


                        {/* =====================================
                 WELCOME CARD
             ===================================== */}

                        <section className="dashboard-welcome-card">

                            <div>

                                <span className="dashboard-card-label">
                                    WELCOME
                                </span>

                                <h2>
                                    Your ClaimCare journey starts here.
                                </h2>

                                <p>
                                    Keep track of your claims, tasks,
                                    documents and important updates from
                                    one place.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="dashboard-primary-action"
                                onClick={() =>
                                    navigate("/claims")
                                }
                            >
                                View My Claims
                            </button>

                        </section>


                        {/* =====================================
                 QUICK ACTIONS
             ===================================== */}

                        <section className="dashboard-section">

                            <div className="dashboard-section-header">

                                <div>

                                    <h2>
                                        Quick Actions
                                    </h2>

                                    <p>
                                        Frequently used ClaimCare actions.
                                    </p>

                                </div>

                            </div>


                            <div className="dashboard-quick-actions">

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/claims/new")
                                    }
                                >
                                    <span>
                                        +
                                    </span>

                                    <strong>
                                        Create Claim
                                    </strong>

                                    <small>
                                        Start a new claim
                                    </small>

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/documents")
                                    }
                                >
                                    <span>
                                        ↑
                                    </span>

                                    <strong>
                                        Upload Document
                                    </strong>

                                    <small>
                                        Add a claim document
                                    </small>

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/claims")
                                    }
                                >
                                    <span>
                                        #
                                    </span>

                                    <strong>
                                        View Claims
                                    </strong>

                                    <small>
                                        Review your claims
                                    </small>

                                </button>


                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/contact")
                                    }
                                >
                                    <span>
                                        ?
                                    </span>

                                    <strong>
                                        Contact Support
                                    </strong>

                                    <small>
                                        Get assistance
                                    </small>

                                </button>

                            </div>

                        </section>


                        {/* =====================================
                 SUMMARY CARDS
             ===================================== */}

                        <section className="dashboard-summary-grid">

                            <div className="dashboard-summary-card">

                                <span>
                                    Active Claims
                                </span>

                                <strong>{activeClaims.length}</strong>

                                <small>
                                    {activeClaims.length ? "Claims awaiting completion" : "No active claims yet"}
                                </small>

                            </div>


                            <div className="dashboard-summary-card">

                                <span>
                                    Outstanding Tasks
                                </span>

                                <strong>{pendingTasks.length}</strong>

                                <small>
                                    Tasks requiring attention
                                </small>

                            </div>


                            <div className="dashboard-summary-card">

                                <span>
                                    Notifications
                                </span>

                                <strong>{unreadNotifications.length}</strong>

                                <small>
                                    Unread notifications
                                </small>

                            </div>


                            <div className="dashboard-summary-card">

                                <span>
                                    Profile Completion
                                </span>

                                <strong>{completion}%</strong>

                                <small>
                                    Complete your profile
                                </small>

                            </div>

                        </section>


                        {/* =====================================
                 ACTIVE CLAIMS
             ===================================== */}

                        <section className="dashboard-section">

                            <div className="dashboard-section-header">

                                <div>

                                    <h2>
                                        Active Claims
                                    </h2>

                                    <p>
                                        Your current claim activity.
                                    </p>

                                </div>

                                <Link to="/claims">
                                    View All
                                </Link>

                            </div>


                            {activeClaims.length ? <div className="dashboard-claim-list">{activeClaims.slice(0,5).map(claim=><article className="dashboard-task" key={claim.id}><div><Link to={`/claims/${claim.id}`}>{claim.claimNumber || claim.id}</Link><p>{claim.category} · {claim.status}</p></div></article>)}</div> : <div className="dashboard-empty-state">

                                <div className="dashboard-empty-icon">
                                    #
                                </div>

                                <h3>
                                    No active claims
                                </h3>

                                <p>
                                    You don't have any active claims yet.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/claims/new")
                                    }
                                >
                                    Start a Claim
                                </button>

                            </div>}

                        </section>


                        {/* =====================================
                 RECENT ACTIVITY + TASKS
             ===================================== */}

                        <div className="dashboard-two-column">

                            {/* RECENT ACTIVITY */}

                            <section className="dashboard-panel">

                                <div className="dashboard-panel-header">

                                    <div>

                                        <h2>
                                            Recent Activity
                                        </h2>

                                        <p>
                                            Recent account and claim activity.
                                        </p>

                                    </div>

                                </div>


                                <div className="dashboard-empty-small">

                                    <span>
                                        —
                                    </span>

                                    <p>
                                        {ownClaims.length ? `Latest claim: ${[...ownClaims].sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0].claimNumber}` : "No recent claim activity."}
                                    </p>

                                </div>

                            </section>


                            {/* TASKS */}

                            <section className="dashboard-panel">

                                <div className="dashboard-panel-header">

                                    <div>

                                        <h2>
                                            Tasks
                                        </h2>

                                        <p>
                                            Outstanding actions.
                                        </p>

                                    </div>

                                    <Link to="/tasks">
                                        View All
                                    </Link>

                                </div>


                                <div className="dashboard-task">

                                    <span className="dashboard-task-icon">
                                        !
                                    </span>

                                    <div>

                                        <strong>
                                            Complete your profile
                                        </strong>

                                        <p>
                                            Add the remaining profile information.
                                        </p>

                                    </div>

                                </div>


                                <div className="dashboard-task">

                                    <span className="dashboard-task-icon">
                                        !
                                    </span>

                                    <div>

                                        <strong>
                                            Review your preferences
                                        </strong>

                                        <p>
                                            Check your communication preferences.
                                        </p>

                                    </div>

                                </div>

                            </section>

                        </div>


                        {/* =====================================
                 POLICY SUMMARY
             ===================================== */}

                        <section className="dashboard-policy-card">

                            <div>

                                <span className="dashboard-card-label">
                                    POLICY SUMMARY
                                </span>

                                <h2>
                                    Your insurance policy information
                                </h2>

                                <p>
                                    {ownPolicies.length ? `${ownPolicies.length} policy record(s), ${ownPolicies.filter(policy => policy.status === "Active" && !policy.archived).length} active.` : "No policy records yet."}
                                </p>

                            </div>

                            <button
                                type="button"
                                onClick={() =>
                                    navigate("/policies")
                                }
                            >
                                View Policies
                            </button>

                        </section>


                        {/* =====================================
                HELP
            ===================================== */}

                        <section className="dashboard-help-card">

                            <div>

                                <h2>
                                    Need help?
                                </h2>

                                <p>
                                    Find answers or contact ClaimCare
                                    support.
                                </p>

                            </div>

                            <div className="dashboard-help-actions">

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/faq")
                                    }
                                >
                                    FAQs
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/contact")
                                    }
                                >
                                    Contact Support
                                </button>

                            </div>

                        </section>

                    </section>

                </div>

            </main>

            <Footer />
        </>
    );
}

export default CustomerDashboard;
