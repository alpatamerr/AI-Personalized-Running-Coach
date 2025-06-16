// const express = require('express');
// const { getAllPlans } = require('../controllers/planController'); // Import plan controller

// const router = express.Router();

// // Route to get all training plans
// router.get('/', getAllPlans);

// module.exports = router;

// const express = require('express');
// const pool = require('../config/db');
// const { generatePlanWithAI } = require('../utils/aiPlanGenerator'); // You'll create this file.
// const router = express.Router();

// // Helper: convert time string ("25:00", "1:45:00", "00:50:00") to seconds
// function timeToSeconds(str) {
//   const parts = str.split(':').map(Number);
//   if (parts.length === 2) return parts[0] * 60 + parts[1];
//   if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
//   return 0;
// }

// // Helper: convert distance string ("5K", "10K", "Half Marathon", "Full Marathon", "Marathon") to number in km
// function distanceToKm(str) {
//   str = str.trim().toLowerCase();
//   if (str.endsWith('k')) return parseFloat(str) || 0;
//   if (str === 'half marathon') return 21.1;
//   if (str === 'full marathon' || str === 'marathon') return 42.195;
//   if (str === 'ultramarathon') return 50; // Adjust for your use case
//   return parseFloat(str) || 0;
// }

// // POST /api/plans/generate-ai (body: { userId })
// router.post('/generate-ai', async (req, res) => {
//   const { userId } = req.body;
//   if (!userId) return res.status(400).json({ error: 'userId required' });

//   try {
//     // Get latest goal for this user
//     const { rows } = await pool.query(
//       `SELECT * FROM goals WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1`, [userId]
//     );
//     if (rows.length === 0) return res.status(404).json({ error: 'No goal found for user' });

//     const goal = rows[0];
//     const distKm = distanceToKm(goal.distance);
//     const timeSec = timeToSeconds(goal.target_time);

//     if (!distKm || !timeSec) {
//       return res.status(400).json({ error: 'Invalid goal data' });
//     }

//     const targetPace = timeSec / distKm;
//     const weeklyDistance = distKm * 4; // Example: 4x race distance

//     // Call the AI microservice (you must implement this, see below)
//     const plan = await generatePlanWithAI({
//       avg_pace: targetPace,
//       goal_pace: targetPace,
//       weekly_distance: weeklyDistance
//     });

//     // Optionally: Save plan to training_plans table if you want to keep history
//     // await pool.query(
//     //   'INSERT INTO training_plans (user_id, goal, start_date, end_date, created_at) VALUES ($1, $2, $3, $4, NOW())',
//     //   [userId, JSON.stringify(plan), new Date(), new Date(), new Date()]
//     // );

//     res.json({ plan });
//   } catch (err) {
//     console.error('AI plan generation error:', err);
//     res.status(500).json({ error: err.message });
//   }
// });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const planController = require('../controllers/planController');

// router.post('/generate-ai', planController.generateTrainingPlan);
// router.get('/dashboard-stats', planController.getDashboardStats);


// router.get('/strava-user-id', async (req, res) => {
//     // Returns the userId of any user with Strava data in run_data
//     const { rows } = await pool.query('SELECT DISTINCT user_id FROM run_data LIMIT 1');
//     if (rows.length) {
//       res.json({ userId: rows[0].user_id });
//     } else {
//       res.status(404).json({ error: 'No Strava user found' });
//     }
//   });

// module.exports = router;

// const express = require('express');
// const router = express.Router();
// const planController = require('../controllers/planController');
// const pool = require('../config/db');

// router.post('/generate-ai', planController.generateTrainingPlan);
// router.get('/dashboard-stats', planController.getDashboardStats);

// // Add this endpoint for your frontend fallback
// router.get('/strava-user-id', async (req, res) => {
//   try {
//     const { rows } = await pool.query('SELECT DISTINCT user_id FROM run_data LIMIT 1');
//     if (rows.length) {
//       res.json({ userId: rows[0].user_id });
//     } else {
//       res.status(404).json({ error: 'No Strava user found' });
//     }
//   } catch (err) {
//     res.status(500).json({ error: 'Database error' });
//   }
// });

// // Add this endpoint for recent activities
// router.get('/recent-activities', async (req, res) => {
//   try {
//     const { userId } = req.query;
//     if (!userId) {
//       return res.status(400).json({ error: "userId required" });
//     }
//     const { rows } = await pool.query(
//       `SELECT run_date as date, distance_km as distance, duration_minutes, pace
//        FROM run_data WHERE user_id = $1
//        ORDER BY run_date DESC LIMIT 10`,
//       [userId]
//     );
//     const activities = rows.map(row => ({
//       date: row.date,
//       distance: Number(row.distance).toFixed(2),
//       time: formatMinutes(row.duration_minutes),
//       pace: row.pace
//     }));
//     res.json({ activities });
//   } catch (err) {
//     res.status(500).json({ error: "Failed to fetch activities" });
//   }
// });

// // Helper for formatting time
// function formatMinutes(duration) {
//   if (!duration) return "";
//   const mins = Math.floor(duration);
//   const secs = Math.round((duration - mins) * 60);
//   return `${mins}:${secs.toString().padStart(2, '0')}`;
// }

// module.exports = router;

const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const pool = require('../config/db');

// Plan generation and stats
router.post('/generate-ai', planController.generateTrainingPlan);
router.get('/dashboard-stats', planController.getDashboardStats);


// Dynamically get a Strava/demo user ID for frontend
router.get('/strava-user-id', async (req, res) => {
  try {
    // Prefer a user with is_strava_user = true
    const { rows } = await pool.query(
      "SELECT id FROM users WHERE is_strava_user = true LIMIT 1"
    );
    if (rows.length) {
      return res.json({ userId: rows[0].id });
    }
    // Fallback: any user in run_data
    const fallback = await pool.query('SELECT DISTINCT user_id FROM run_data LIMIT 1');
    if (fallback.rows.length) {
      return res.json({ userId: fallback.rows[0].user_id });
    }
    res.status(404).json({ error: 'No Strava user found' });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Recent activities for a user
router.get('/recent-activities', async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ error: "userId required" });
    }
    const { rows } = await pool.query(
      `SELECT run_date as date, distance_km as distance, duration_minutes, pace
       FROM run_data WHERE user_id = $1
       ORDER BY run_date DESC LIMIT 10`,
      [userId]
    );
    const activities = rows.map(row => ({
      date: row.date,
      distance: Number(row.distance).toFixed(2),
      time: formatMinutes(row.duration_minutes),
      pace: row.pace
    }));
    res.json({ activities });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch activities" });
  }
});

// Helper for formatting time
function formatMinutes(duration) {
  if (!duration) return "";
  const mins = Math.floor(duration);
  const secs = Math.round((duration - mins) * 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

module.exports = router;