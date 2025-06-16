// API Configuration
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Strava Configuration
export const STRAVA_CLIENT_ID = import.meta.env.VITE_STRAVA_CLIENT_ID;
export const STRAVA_REDIRECT_URI = import.meta.env.VITE_STRAVA_REDIRECT_URI || 'http://localhost:5173/strava/callback';

// Feature Flags
export const FEATURES = {
  STRAVA_INTEGRATION: true,
  GOAL_SETTING: true,
  TRAINING_PLANS: true,
  PERFORMANCE_ANALYTICS: true
}; 