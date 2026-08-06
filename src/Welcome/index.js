import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../Sharedcomponents/Buttons';
import './style.css';

const WelcomePage = () => {
  const navigate = useNavigate();

  const handleGetStartedClick = () => {
    navigate('/login');
  };

  const handleLearnMoreClick = () => {
  };

  return (
    <div className="welcome-page-container">
      <div className="left-section">
        <img src="images/background.jpg" alt="Decorative pillow" className="pillow-image" />
      </div>
      <div className="right-section">
        <div className="logo-container">
          <img src="images/logo.png" alt="Logo icon" className="brand-logo" />
        </div>
        <h1>
          Ready to make a change?
        </h1>
        <p>Start your recycling journey today.</p>
        <div className="button-group">
          <Button variant="primary" onClick={handleGetStartedClick}>
            Get Started
          </Button>
          <Button variant="secondary" onClick={handleLearnMoreClick}>Learn More</Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomePage;
