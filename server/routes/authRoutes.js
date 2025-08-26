const express = require('express');
const router = express.Router();

// Constants for Strava OAuth
const STRAVA_CLIENT_ID = process.env.STRAVA_CLIENT_ID;
const STRAVA_CLIENT_SECRET = process.env.STRAVA_CLIENT_SECRET;
const STRAVA_REDIRECT_URI = 'http://localhost:5000/api/auth/strava/callback';

// Check authentication status
router.get('/check', (req, res) => {
  if (req.session.user) {
    return res.json({ 
      authenticated: true, 
      userId: req.session.user.id 
    });
  }
  return res.status(401).json({ authenticated: false });
});

// Get current user
router.get('/me', (req, res) => {
  if (req.session.user) {
    res.json({ userId: req.session.user.id });
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Initiate Strava OAuth
router.get('/strava', (req, res) => {
  const scope = 'read,activity:read_all';
  const authUrl = `https://www.strava.com/oauth/authorize?client_id=${STRAVA_CLIENT_ID}&response_type=code&redirect_uri=${STRAVA_REDIRECT_URI}&scope=${scope}&state=mystate`;
  res.redirect(authUrl);
});

// Strava OAuth callback
router.get('/strava/callback', async (req, res) => {
  const { code, error } = req.query;
  
  if (error) {
    console.error('Strava auth error:', error);
    return res.redirect('http://localhost:5173/login');
  }

  try {
    // Exchange code for token
    const tokenResponse = await fetch('https://www.strava.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: STRAVA_CLIENT_ID,
        client_secret: STRAVA_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code'
      })
    });

    if (!tokenResponse.ok) {
      throw new Error(`HTTP error! status: ${tokenResponse.status}`);
    }

    const data = await tokenResponse.json();
    const { access_token, refresh_token, athlete } = data;
    
    // Create user object
    const user = {
      id: athlete.id,
      displayName: `${athlete.firstname} ${athlete.lastname}`,
      stravaAccessToken: access_token,
      stravaRefreshToken: refresh_token,
      profile: athlete
    };

    console.log('Strava authentication successful:', { userId: user.id, name: user.displayName });

    // Store in session
    req.session.regenerate((err) => {
      if (err) {
        console.error('Session regeneration error:', err);
        return res.redirect('http://localhost:5173/login');
      }

      req.session.user = user;
      req.session.save((err) => {
        if (err) {
          console.error('Session save error:', err);
          return res.redirect('http://localhost:5173/login');
        }
        
        console.log('Session saved successfully for user:', user.id);
        res.redirect('http://localhost:5173/auth/callback');
      });
    });
  } catch (error) {
    console.error('Token exchange error:', error.message);
    res.redirect('http://localhost:5173/login');
  }
});

// Logout
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('http://localhost:5173/login');
  });
});

module.exports = router;