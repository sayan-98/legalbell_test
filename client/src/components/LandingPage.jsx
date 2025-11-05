import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      <div className="landing-card">
        <h1 className="landing-title">Welcome to LegalBell</h1>
        <p className="landing-subtitle">Select your role to continue:</p>
        <div className="landing-buttons">
          <button onClick={() => navigate("/client-login")} className="landing-btn">
            Client
          </button>
          <button onClick={() => navigate("/lawyer-login")} className="landing-btn">
            Lawyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
