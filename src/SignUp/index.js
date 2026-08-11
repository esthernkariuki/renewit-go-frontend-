import React from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Button } from "../Sharedcomponents/Buttons";
import { useFetchSignUp } from "../hooks/useFetchSignUp";
import { usePasswordToggle } from "../hooks/usePasswordToggle";

import "./style.css";

const SignUp = () => {
  const {
    formData,
    error,
    loading,
    handleChange,
    handleSubmit,
  } = useFetchSignUp();

  const [showPassword, toggleShowPassword] =
    usePasswordToggle();

  const [showConfirmPassword, toggleShowConfirmPassword] =
    usePasswordToggle();

  return (
    <div
      className="signup-page"
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
      <div className="signup-overlay">
        <div className="signup-card">

          {/* RenewIt Logo */}
          <img
            src={`${process.env.PUBLIC_URL}/images/renewit-logo.png`}
            alt="RenewIt Logo"
            className="signup-logo"
          />

          {/* Heading */}
          <h1>Create Account</h1>

          <p className="signup-subtitle">
            Join Kenya's circular economy by buying,
            selling and upcycling reusable materials.
          </p>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit}>

            {/* Full Name */}
            <div className="form-group">
              <label htmlFor="name">
                Full Name
              </label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone Number */}
            <div className="form-group">
              <label htmlFor="phone">
                Phone Number
              </label>

              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="0712345678"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </div>

            {/* Role */}
            <div className="form-group">
              <label>
                Role
              </label>

              <div className="role-buttons">

                {/* Buyer */}
                <button
                  type="button"
                  className={
                    formData.role === "buyer"
                      ? "role-btn active"
                      : "role-btn"
                  }
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "role",
                        value: "buyer",
                      },
                    })
                  }
                >
                  Buyer
                </button>

                {/* Trader */}
                <button
                  type="button"
                  className={
                    formData.role === "trader"
                      ? "role-btn active"
                      : "role-btn"
                  }
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "role",
                        value: "trader",
                      },
                    })
                  }
                >
                  Trader
                </button>

                {/* Upcycler */}
                <button
                  type="button"
                  className={
                    formData.role === "upcycler"
                      ? "role-btn active"
                      : "role-btn"
                  }
                  onClick={() =>
                    handleChange({
                      target: {
                        name: "role",
                        value: "upcycler",
                      },
                    })
                  }
                >
                  Upcycler
                </button>

              </div>
            </div>

            {/* Password */}
            <div className="form-group password-group">
              <label htmlFor="password">
                Password
              </label>

              <input
                id="password"
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="password-toggle-icon"
                onClick={toggleShowPassword}
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

            {/* Confirm Password */}
            <div className="form-group password-group">
              <label htmlFor="confirmPassword">
                Confirm Password
              </label>

              <input
                id="confirmPassword"
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="password-toggle-icon"
                onClick={toggleShowConfirmPassword}
                aria-label={
                  showConfirmPassword
                    ? "Hide password"
                    : "Show password"
                }
              >
                {showConfirmPassword ? (
                  <FaEye />
                ) : (
                  <FaEyeSlash />
                )}
              </button>
            </div>

            {/* Error */}
            {error && (
              <p className="signup-error">
                {error}
              </p>
            )}

            {/* Submit */}
            <Button
              type="submit"
              className="signup-form-button"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Account"}
            </Button>

          </form>

          {/* Login */}
          <p className="login-link-text">
            Already have an account?

            <Link to="/login">
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default SignUp;