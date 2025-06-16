const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
require('dotenv').config();
const StravaStrategy = require('passport-strava-oauth2').Strategy;

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID, // Your Google Client ID
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Your Google Client Secret
      callbackURL: '/api/auth/google/callback', // Callback URL after Google login
    },
    (accessToken, refreshToken, profile, done) => {
      // Handle user profile here
      console.log('Google Profile:', profile);
      // Pass the profile to the next middleware
      done(null, profile);
    }
  )
);

// Strava OAuth Strategy
passport.use(
  new StravaStrategy(
    {
      clientID: process.env.STRAVA_CLIENT_ID,
      clientSecret: process.env.STRAVA_CLIENT_SECRET,
      callbackURL: '/api/auth/strava/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      if (profile.id === 139463954) {
        return done(null, false, { message: 'This Strava account is reserved for system use.' });
      }
      // You may want to check if the user exists in your DB, etc.
      return done(null, profile);
    }
  )
);

// Serialize user (save user data in session)
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user (retrieve user data from session)
passport.deserializeUser((user, done) => {
  done(null, user);
});