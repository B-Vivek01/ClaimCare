import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth, db } from "../firebase/Firebase";
import { doc, getDoc } from "firebase/firestore";

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

            const userDoc = await getDoc(
                doc(db, "customers", user.uid)
            );

            if (!userDoc.exists()) {
                setError("User account not found.");
                return;
            }

            const userData = userDoc.data();
            const role = userData.role || "customer";

            // Navigate according to role
            if (role === "admin") {
                navigate("/admin");
            } else if (role === "operations") {
                navigate("/ops");
            } else {
                navigate("/dashboard");
            }

        } catch (error) {
            console.error("Login error:", error);

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
                        error.message || errorMessage;
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
                            <div className="login-error">
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