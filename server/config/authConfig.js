const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport');
require('dotenv').config();
const StravaStrategy = require('passport-strava-oauth2').Strategy;

// Passport session setup
passport.serializeUser((user, done) => {
  console.log('Serializing user:CCCCCC', { user });
  console.log('Serializing user:BBBBB', { id: user.id, provider: user.provider });
  console.log('Serializing user:AAAAAAAAAA', { id: user.id, provider: user.provider });
  // Only store essential user data in session
  const sessionUser = {
    id: user.id,
    provider: user.provider,
    displayName: user.displayName
  };
  done(null, sessionUser);
});

passport.deserializeUser((sessionUser, done) => {
  console.log('Deserializing user:', sessionUser);
  done(null, sessionUser);
});

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/api/auth/google/callback',
    },
    (accessToken, refreshToken, profile, done) => {
      console.log('Google Profile:', profile);
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
      console.log('Strava Profile:', profile);
      // Create a user object with essential data
      const user = {
        id: profile.id,
        provider: profile.provider,
        displayName: profile.displayName,
        stravaAccessToken: accessToken,
        stravaRefreshToken: refreshToken
      };
      return done(null, user);
    }
  )
);