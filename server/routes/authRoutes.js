const express = require('express');
const passport = require('passport');
const StravaStrategy = require('passport-strava-oauth2').Strategy;
const router = express.Router();

// Google Authentication Route
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/me', (req, res) => {
  if (req.isAuthenticated() && req.user) {
    res.json({ userId: req.user.id || req.user._json?.id });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

router.get('/check', (req, res) => {
  // If you use sessions:
  if (req.isAuthenticated && req.isAuthenticated() && req.user) {
    return res.json({ authenticated: true, userId: req.user.id || req.user._json?.id });
  }
  // If not authenticated:
  return res.status(401).json({ authenticated: false });
});

// Google Authentication Callback
router.get(
  '/google/callback',
  passport.authenticate('google', {
    successRedirect: 'http://localhost:5173/auth/callback', // Redirect on success
    failureRedirect: 'http://localhost:5173/login', // Redirect on failure
  })
);

// Strava Authentication Route
router.get(
  '/strava',
  passport.authenticate('strava', { scope: ['read,activity:read_all'] })
);

router.get(
  '/strava/callback',
  passport.authenticate('strava', {
    successRedirect: 'http://localhost:5173/auth/callback',
    failureRedirect: 'http://localhost:5173/login',
  })
);


module.exports = router;