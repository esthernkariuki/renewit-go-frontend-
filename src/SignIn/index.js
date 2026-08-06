import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { loginUser } from "../utils/api/fetchLogin";
import "./style.css";

const SignIn = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ emailOrUsername: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const data = await loginUser({
        username: formData.emailOrUsername,
        password: formData.password,
      });

      if (!data.token || typeof data.token !== "string") {
        setError("Invalid server response: Token missing or invalid");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username || formData.emailOrUsername);

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
    <div className="login-page-container">
      <div className="login-left-panel">
        <div className="login-header">
          <span>RenewIt</span>
        </div>
        <div className="login-hero-text">
          <h1>Your Inspiration</h1>
          <h1>Your Vision</h1>
          <h1>Your Story</h1>
          <p>Sign-in to unlock your imagination</p>
        </div>
      </div>

      <div className="login-right-panel">
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="emailOrUsername">Email or Username</label>
            <input
              type="text"
              id="emailOrUsername"
              name="emailOrUsername"
              value={formData.emailOrUsername}
              onChange={handleChange}
              placeholder="Enter your email or username"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group" style={{ position: "relative" }}>
            <label htmlFor="password">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              disabled={loading}
              aria-describedby="passwordHelp"
            />
            <span
              className="password-toggle-icon"
              onClick={toggleShowPassword}
              role="button"
              tabIndex={0}
              aria-label={showPassword ? "Hide password" : "Show password"}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") toggleShowPassword();
              }}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {error && (
            <div role="alert" style={{ color: "red", marginBottom: "15px" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="signin-form-button"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="signup-link-text">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  );
};

export default SignIn;
