import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { signInWithEmailAndPassword } from "../backend/auth";

import { auth, db } from "../backend/session";
import { doc, getDoc } from "../backend/profiles";

function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (error) {
            setError("");
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!formData.email.trim()) {
            setError("Email address is required.");
            return;
        }

        if (!formData.password) {
            setError("Password is required.");
            return;
        }

        setLoading(true);

        try {
            /*
             * Firebase Authentication
             */
            const userCredential =
                await signInWithEmailAndPassword(
                    auth,
                    formData.email.trim(),
                    formData.password
                );

            const user = userCredential.user;

            /*
             * Get customer information from Firestore
             */
            const userDoc = await getDoc(
                doc(db, "customers", user.uid)
            );

            if (!userDoc.exists()) {
                setError("User account not found.");
                return;
            }

            const userData = userDoc.data();

            /*
             * Get customer name.
             *
             * We check all possible fields that may
             * exist in your customers collection.
             */
            let customerName = "";

            if (
                userData.customerName &&
                String(userData.customerName).trim()
            ) {
                customerName =
                    String(
                        userData.customerName
                    ).trim();
            } else if (
                userData.name &&
                String(userData.name).trim()
            ) {
                customerName =
                    String(userData.name).trim();
            } else if (
                userData.fullName &&
                String(userData.fullName).trim()
            ) {
                customerName =
                    String(userData.fullName).trim();
            } else if (
                userData.username &&
                String(userData.username).trim()
            ) {
                customerName =
                    String(userData.username).trim();
            } else if (
                userData.userName &&
                String(userData.userName).trim()
            ) {
                customerName =
                    String(userData.userName).trim();
            } else if (
                userData.displayName &&
                String(userData.displayName).trim()
            ) {
                customerName =
                    String(userData.displayName).trim();
            } else if (
                userData.firstName ||
                userData.lastName
            ) {
                customerName = [
                    userData.firstName,
                    userData.lastName,
                ]
                    .filter(Boolean)
                    .join(" ")
                    .trim();
            } else if (
                user.displayName &&
                user.displayName.trim()
            ) {
                customerName =
                    user.displayName.trim();
            }

            /*
             * If we still don't have a name,
             * use the email as a last fallback.
             *
             * This prevents the Customer field from
             * being completely blank.
             */
            if (!customerName) {
                customerName =
                    user.email || "";
            }

            /*
             * Store currently logged-in user.
             */
            localStorage.setItem(
                "claimcare_current_user",
                JSON.stringify({
                    uid: user.uid,
                    email: user.email || "",
                    name: customerName,
                    customerName: customerName,
                    role:
                        userData.role ||
                        "customer",
                })
            );

            /*
             * Store customer name separately.
             */
            localStorage.setItem(
                "claimcare_user_name",
                customerName
            );

            /*
             * Store Firebase UID.
             */
            localStorage.setItem(
                "claimcare_user_uid",
                user.uid
            );

            const role =
                userData.role || "customer";

            /*
             * Navigate according to role.
             */
            if (role === "admin") {
                navigate("/admin");
            } else if (role === "operations") {
                navigate("/ops");
            } else {
                navigate("/dashboard");
            }

        } catch (error) {
            console.error(
                "Login error:",
                error
            );

            let errorMessage =
                "Invalid email or password.";

            switch (error.code) {
                case "auth/invalid-credential":
                    errorMessage =
                        "Invalid email or password.";
                    break;

                case "auth/user-not-found":
                    errorMessage =
                        "No account exists with this email address.";
                    break;

                case "auth/wrong-password":
                    errorMessage =
                        "Incorrect password.";
                    break;

                case "auth/user-disabled":
                    errorMessage =
                        "This account has been disabled.";
                    break;

                case "auth/too-many-requests":
                    errorMessage =
                        "Too many login attempts. Please try again later.";
                    break;

                case "auth/network-request-failed":
                    errorMessage =
                        "Network error. Please check your internet connection.";
                    break;

                default:
                    errorMessage =
                        error.message ||
                        errorMessage;
            }

            setError(errorMessage);

        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />

            <main className="login-page">

                <section className="login-container">

                    <div className="login-header">

                        <span className="register-badge">
                            WELCOME BACK
                        </span>

                        <h1>
                            Sign in to ClaimCare
                        </h1>

                        <p>
                            Login to access your claims,
                            policies and documents.
                        </p>

                    </div>

                    <form
                        className="login-form"
                        onSubmit={handleSubmit}
                        noValidate
                    >

                        {/* EMAIL */}

                        <div className="login-field">

                            <label htmlFor="email">
                                Email Address
                            </label>

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter your email address"
                                autoComplete="email"
                            />

                        </div>

                        {/* PASSWORD */}

                        <div className="login-field">

                            <label htmlFor="password">
                                Password
                            </label>

                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter your password"
                                autoComplete="current-password"
                            />

                        </div>

                        {/* ERROR */}

                        {error && (
                            <div className="login-error" role="alert">
                                {error}
                            </div>
                        )}

                        {/* LOGIN */}

                        <button
                            type="submit"
                            className="register-submit"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="register-spinner" />
                                    Signing In...
                                </>
                            ) : (
                                "Sign In"
                            )}
                        </button>

                        {/* REGISTER */}
                        <p><Link to="/forgot-password">Forgot your password?</Link></p>
                        <p><Link to="/confirm-email">Email not confirmed? Resend the confirmation link</Link></p>

                        <p className="registration-login-text">
                            Don't have an account?{" "}

                            <Link to="/register">
                                Create an account
                            </Link>
                        </p>

                    </form>

                </section>

            </main>

            <Footer />
        </>
    );
}

export default Login;
