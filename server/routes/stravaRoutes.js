const express = require('express');
const router = express.Router();
const stravaController = require('../controllers/stravaController');

// Route to manually trigger Strava data sync
router.post('/sync-strava', stravaController.syncStravaData);

module.exports = router;