import React from 'react';
import '../styles/SocialLogin.css';
import GoogleIcon from '../assets/google-icon.svg';
import StravaIcon from '../assets/strava-icon.svg';


// This component handles social login using Google and Strava

const SocialLogin = () => {
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const handleStravaLogin = () => {
    window.location.href = '/api/auth/strava';
  };

  return (
    <div className="social-login">
      <div className="social-divider">
        <span>or continue with</span>
      </div>
      
      <div className="social-buttons">
        <button 
          className="social-button google"
          onClick={handleGoogleLogin}
        >
          <img src={GoogleIcon} alt="Google" />
          Continue with Google
        </button>
        <button
          className="social-button strava"
          onClick={handleStravaLogin}
        >
          <img src={StravaIcon} alt="Strava" />
          Continue with Strava
        </button>
      </div>
    </div>
  );
};

export default SocialLogin; 