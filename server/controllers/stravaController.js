const pool = require('../config/db');
const axios = require('axios');
require('dotenv').config();

// Fetch all activities from Strava API (with pagination)
const fetchAllActivities = async (accessToken) => {
  let currentPage = 1;
  const perPage = 150;
  let activities = [];
  let hasMore = true;

  while (hasMore) {
    try {
      const response = await axios.get(
        `https://www.strava.com/api/v3/athlete/activities?page=${currentPage}&per_page=${perPage}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const pageActivities = response.data;
      console.log(`Page ${currentPage}: Fetched ${pageActivities.length} activities`);

      if (pageActivities.length > 0) {
        activities = activities.concat(pageActivities);
        currentPage++;
      } else {
        hasMore = false;
      }
    } catch (err) {
      console.error(`❌ Error fetching activities on page ${currentPage}:`, err);
      throw err; // Stop further execution
    }
  }

  console.log(`Total activities fetched: ${activities.length}`);
  return activities;
};

// Sync Strava data
const syncStravaData = async (req, res, next) => {
  try {
    const accessToken = process.env.STRAVA_ACCESS_TOKEN;
    const athleteId = process.env.STRAVA_USER_ID;

    if (!accessToken || !athleteId) {
      return res.status(400).json({
        error: 'Access token and athlete ID are required in environment variables',
      });
    }

    let user = await pool.query('SELECT id FROM users WHERE id = $1', [athleteId]);

    if (user.rowCount === 0) {
      const username = `athlete_${athleteId}`;
      const email = `athlete_${athleteId}@example.com`;
      const password = 'strava_user';

      const newUser = await pool.query(
        `INSERT INTO users (id, username, email, password)
         VALUES ($1, $2, $3, $4)
         RETURNING id`,
        [athleteId, username, email, password]
      );

      user = newUser;
    }

    const userId = user.rows[0].id;

    const activities = await fetchAllActivities(accessToken);
    if (activities.length === 0) {
      return res.status(404).json({ message: 'No activities found for the user' });
    }

    for (const activity of activities) {
      if (activity.sport_type !== "Run") {
        console.log(`Skipping non-running activity: ${activity.sport_type}`);
        continue;
      }
      if (!activity.distance || activity.distance === 0 || !activity.start_date) {
        console.log(`Skipping invalid activity: ${activity.id}`);
        continue;
      }

      const distanceKm = activity.distance / 1000;
      const durationMinutes = activity.moving_time / 60;

      // Calculate numeric pace (min/km)
      let pace = null;
      if (distanceKm > 0) {
        const totalMinutes = activity.moving_time / 60 / distanceKm;
        pace = parseFloat(totalMinutes.toFixed(2)); // Convert to numeric
      }

      const averageCadence = activity.average_cadence
        ? Math.round(activity.average_cadence * 2)
        : null;

      const hasHeartrate = activity.has_heartrate;
      const averageHeartrate = hasHeartrate ? activity.average_heartrate : null;
      const maxHeartrate = hasHeartrate ? activity.max_heartrate : null;

      const runDate = activity.start_date.split('T')[0];
      const activityId = activity.id;
      const sportType = activity.sport_type;

      try {
        await pool.query(
          `INSERT INTO run_data (
            user_id, distance_km, duration_minutes, pace, average_cadence,
            has_heartrate, average_heartrate, max_heartrate,
            run_date, activity_id, sport_type
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (user_id, run_date)
          DO UPDATE SET
            distance_km = EXCLUDED.distance_km,
            duration_minutes = EXCLUDED.duration_minutes,
            pace = EXCLUDED.pace,
            average_cadence = EXCLUDED.average_cadence,
            has_heartrate = EXCLUDED.has_heartrate,
            average_heartrate = EXCLUDED.average_heartrate,
            max_heartrate = EXCLUDED.max_heartrate,
            activity_id = EXCLUDED.activity_id,
            sport_type = EXCLUDED.sport_type;
          `,
          [
            userId,
            distanceKm,
            durationMinutes,
            pace,
            averageCadence,
            hasHeartrate,
            averageHeartrate,
            maxHeartrate,
            runDate,
            activityId,
            sportType,
          ]
        );
      } catch (insertErr) {
        console.error(`❌ Failed to sync ${activityId}:`, insertErr);
      }
    }

    res.json({ message: '✅ Strava data synced successfully!' });
  } catch (err) {
    console.error('❌ Error syncing Strava data:', err);
    next(err);
  }
};

module.exports = { syncStravaData };