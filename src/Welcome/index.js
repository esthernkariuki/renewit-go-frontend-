import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../Sharedcomponents/Buttons";
import "./style.css";

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate("/login");
  };

  const handleLearnMoreClick = () => {
    console.log("Learn More clicked");
  };

  return (
    <div
      className="welcome-page"
      style={{
        backgroundImage: `
          linear-gradient(
            135deg,
            rgba(10, 45, 18, 0.90),
            rgba(20, 90, 35, 0.68),
            rgba(0, 0, 0, 0.42)
          ),
          url("${process.env.PUBLIC_URL}/images/background.jpg")
        `,
      }}
    >

      {/* Main Content */}
      <div className="welcome-content">

        {/* Logo */}
        <div className="welcome-logo-container">

          <img
            src={`${process.env.PUBLIC_URL}/images/logo.png`}
            alt="RenewIt Logo"
            className="welcome-logo"
          />

          <span className="welcome-brand-name">
            RenewIt
          </span>

        </div>

        {/* Text */}
        <div className="welcome-text">

          <p className="welcome-small-title">
            WELCOME TO RENEWIT
          </p>

          <h1>
            Give Materials
            <span>A New Life.</span>
          </h1>

          <p className="welcome-description">
            Discover a smarter way to buy, sell and
            upcycle reusable materials while helping
            build a cleaner, more sustainable Kenya.
          </p>

        </div>

        {/* Buttons */}
        <div className="welcome-buttons">

          <Button
            variant="primary"
            onClick={handleGetStartedClick}
          >
            Get Started
          </Button>

          <Button
            variant="secondary"
            onClick={handleLearnMoreClick}
          >
            Learn More
          </Button>

        </div>

        {/* Footer */}
        <div className="welcome-footer">

          <span className="footer-line"></span>

          <p>
            ♻️ Buy • Sell • Upcycle • Renew
          </p>

          <span className="footer-line"></span>

        </div>

      </div>

    </div>
  );
};

export default WelcomePage;