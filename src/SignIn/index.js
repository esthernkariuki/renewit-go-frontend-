import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../utils/api/fetchLogin";
import "./style.css";

const SignIn = () => {
  const navigate = useNavigate();

const [formData, setFormData] = useState({
  phone: "",
  password: "",
});

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError(null);
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  setError(null);
  setLoading(true);

  try {
    const data = await loginUser({
      phone: formData.phone,
      password: formData.password,
    });

    if (!data.token || typeof data.token !== "string") {
      setError("Invalid server response: Token missing or invalid");
      return;
    }

    localStorage.setItem("token", data.token);
    localStorage.setItem("phone", formData.phone);

    navigate("/dashboard");

  } catch (err) {
    setError(
      err.message === "Failed to fetch"
        ? "Unable to connect to server"
        : err.message
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `
          linear-gradient(
            rgba(18, 44, 25, 0.6),
            rgba(18, 44, 25, 0.6)
          ),
          url("${process.env.PUBLIC_URL}/images/background.jpg")
        `,
      }}
    >
      <div className="login-overlay">

        <div className="login-card">

          {/* Logo */}
          <img
            src={`${process.env.PUBLIC_URL}/images/renewit-logo.png`}
            alt="RenewIt Logo"
            className="login-logo"
          />

          {/* Heading */}
          <h1>Welcome Back</h1>

          <p className="login-subtitle">
            Sign in to continue your journey with
            RenewIt and be part of Kenya's circular economy.
          </p>

          <form onSubmit={handleSubmit}>

            {/* Phone Number */}
            <div className="login-form-group">

              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                type="tel"
                id="phone"
                name="phone"
                placeholder="07XXXXXXXX"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={loading}
              />

            </div>

            {/* Password */}
            <div className="login-form-group login-password-group">

              <label htmlFor="password">
                Password
              </label>

              <div className="login-password-wrapper">

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />

                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={toggleShowPassword}
                  disabled={loading}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <FaEye />
                  ) : (
                    <FaEyeSlash />
                  )}
                </button>

              </div>

            </div>

            {/* Error */}
            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            {/* Sign In */}
            <button
              type="submit"
              className="login-form-button"
              disabled={loading}
            >
              {loading
                ? "Signing In..."
                : "Sign In"}
            </button>

          </form>

          {/* Sign Up */}
          <p className="login-signup-text">
            Don't have an account?

            <Link to="/signup">
              Sign Up
            </Link>
          </p>

        </div>

      </div>
    </div>
  );
};

export default SignIn;