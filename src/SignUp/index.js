import React from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Button } from '../Sharedcomponents/Buttons';
import { useFetchSignUp} from '../hooks/useFetchSignUp';
import {usePasswordToggle} from '../hooks/usePasswordToggle'
import './style.css';

const SignUp = () => {
  const {
    formData,
    error,
    loading,
    handleChange,
    handleSubmit,
  } = useFetchSignUp();

  const [showPassword, toggleShowPassword] = usePasswordToggle();
  const [showConfirmPassword, toggleShowConfirmPassword] = usePasswordToggle();

  return (
    <div className="signup-page-container">
      <div className="signup-left-panel">
        <div className="signup-header"><span>RenewIt</span></div>
        <div className="signup-hero-text">
          <h1>Your Inspiration</h1>
          <h1>Your Vision</h1>
          <h1>Your Story</h1>
          <p>Sign-up to unlock your imagination</p>
        </div>
      </div>

      <div className="signup-right-panel">
        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} data-testid="signup-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required  />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter a username"
              required
              autoComplete="username"/>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              autoComplete="email"/>
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
              autoComplete="tel"/>
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              autoComplete="new-password"/>
            <span
              className="password-toggle-icon"
              role="button"
              tabIndex={0}
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={toggleShowPassword}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleShowPassword(); }}
              style={{ cursor: 'pointer' }}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <div className="form-group" style={{ position: 'relative' }}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
              required
              autoComplete="new-password"
            />
            <span
              className="password-toggle-icon"
              role="button"
              tabIndex={0}
              aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
              onClick={toggleShowConfirmPassword}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') toggleShowConfirmPassword(); }}
              style={{ cursor: 'pointer' }}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {error && <p style={{ color: 'red', marginBottom: '15px' }}>{error}</p>}

          <Button
            type="submit"
            variant="primary"
            disabled={loading}
            className="signup-form-button"
          >
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>

        <p className="login-link-text">
          Already have an account? <Link to="/login">Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
