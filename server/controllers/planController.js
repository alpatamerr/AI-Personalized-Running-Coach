// const pool = require('../config/db');

// // Fetch all training plans
// const getAllPlans = async (req, res, next) => {
//   try {
//     const result = await pool.query('SELECT * FROM training_plans');
//     res.json(result.rows);
//   } catch (err) {
//     next(err); // Pass the error to the error-handling middleware
//   }
// };

// module.exports = { getAllPlans };

// const pool = require('../config/db');

// // Helper: Get recent N weeks of running stats for a user
// async function getRecentStats(userId, weeks = 8) {
//   // Get today and N weeks ago
//   const today = new Date();
//   const pastDate = new Date(today);
//   pastDate.setDate(today.getDate() - weeks * 7);
//   const startDate = pastDate.toISOString().slice(0, 10);

//   // Fetch runs from the last N weeks
//   const { rows } = await pool.query(
//     `SELECT * FROM run_data WHERE user_id = $1 AND run_date >= $2 ORDER BY run_date DESC`,
//     [userId, startDate]
//   );

//   if (!rows.length) return null;

//   // Weekly stats
//   const stats = {};
//   rows.forEach(run => {
//     const week = getIsoWeek(run.run_date);
//     if (!stats[week]) stats[week] = [];
//     stats[week].push(run);
//   });

//   // Aggregate stats per week
//   const weeksStats = Object.entries(stats).map(([week, runs]) => {
//     const total_km = runs.reduce((a, r) => a + Number(r.distance_km), 0);
//     const avg_pace = runs.reduce((a, r) => a + Number(r.pace || 0), 0) / runs.length;
//     const avg_hr = runs
//       .filter(r => r.average_heartrate)
//       .reduce((a, r, i, arr) => a + Number(r.average_heartrate), 0) /
//       (runs.filter(r => r.average_heartrate).length || 1);
//     const avg_cadence = runs
//       .filter(r => r.average_cadence)
//       .reduce((a, r) => a + Number(r.average_cadence), 0) /
//       (runs.filter(r => r.average_cadence).length || 1);
//     return {
//       week,
//       total_km: Number(total_km.toFixed(2)),
//       avg_pace: Number(avg_pace.toFixed(2)),
//       avg_hr: avg_hr ? Number(avg_hr.toFixed(1)) : null,
//       avg_cadence: avg_cadence ? Math.round(avg_cadence) : null,
//       count: runs.length,
//     };
//   });
//   return weeksStats;
// }

// // Helper: ISO week number
// function getIsoWeek(dateStr) {
//   const d = new Date(dateStr);
//   d.setHours(0,0,0,0);
//   d.setDate(d.getDate() + 4 - (d.getDay()||7));
//   const yearStart = new Date(d.getFullYear(),0,1);
//   return `${d.getFullYear()}-W${String(Math.ceil((((d - yearStart) / 86400000) + 1)/7)).padStart(2,'0')}`;
// }

// // Helper: Compute overall stats (last N weeks)
// async function getOverallStats(userId, weeks = 8) {
//   const weeklyStats = await getRecentStats(userId, weeks);
//   if (!weeklyStats) return null;
//   const allRuns = weeklyStats.reduce((arr, wk) => arr.concat(wk), []);
//   const total_km = weeklyStats.reduce((a, w) => a + w.total_km, 0);
//   const avg_pace = (weeklyStats.reduce((a, w) => a + (w.avg_pace || 0), 0) / weeklyStats.length);
//   const avg_hr = (weeklyStats.reduce((a, w) => a + (w.avg_hr || 0), 0) / weeklyStats.length);
//   const avg_cadence = (weeklyStats.reduce((a, w) => a + (w.avg_cadence || 0), 0) / weeklyStats.length);

//   return {
//     total_km: Number(total_km.toFixed(2)),
//     avg_pace: avg_pace ? Number(avg_pace.toFixed(2)) : null,
//     avg_hr: avg_hr ? Number(avg_hr.toFixed(1)) : null,
//     avg_cadence: avg_cadence ? Math.round(avg_cadence) : null,
//     weeks: weeklyStats
//   };
// }

// // Heuristic or simple AI plan generator (12/16 weeks)
// function generatePlan({ goalDistance, targetTime, preferredDays, weeklyKm, weeks, stats }) {
//   // Use stats to set initial paces, ramp up, and run types
//   const weekPlan = [];
//   const runTypes = ['Easy', 'Tempo', 'Intervals', 'Long'];
//   const days = preferredDays.length ? preferredDays : ['Monday', 'Wednesday', 'Saturday'];

//   // Parse target pace
//   let [h = 0, m = 0, s = 0] = targetTime.split(':').map(Number);
//   if (targetTime.split(':').length === 2) [m, s] = targetTime.split(':').map(Number);
//   const totalTargetMins = h * 60 + m + s / 60;
//   const goalKm = parseFloat(goalDistance.replace(/[^\d.]/g, '')) || 10;
//   const goalPace = totalTargetMins / goalKm; // min/km

//   // Initial paces from user stats, fallback to goal pace
//   const initialPace = (stats && stats.avg_pace) ? stats.avg_pace : goalPace + 1;

//   let currentWeeklyKm = stats && stats.weeks && stats.weeks.length > 0
//     ? Math.max(...stats.weeks.map(w => w.total_km))
//     : weeklyKm ? parseFloat(weeklyKm) : 25;

//   // Ramp up to weeklyKm
//   const rampWeeks = Math.min(4, weeks);
//   const stepKm = (weeklyKm - currentWeeklyKm) / rampWeeks;

//   for (let w = 1; w <= weeks; ++w) {
//     let thisWeekKm = w <= rampWeeks
//       ? currentWeeklyKm + stepKm * w
//       : weeklyKm;
//     thisWeekKm = Math.max(10, Math.round(thisWeekKm));

//     // Spread runs over preferred days
//     const runs = [];
//     let leftKm = thisWeekKm;
//     for (let d = 0; d < days.length; ++d) {
//       let runType = 'Easy';
//       if (d === 0) runType = 'Tempo';
//       if (d === days.length - 1) runType = 'Long';
//       let runKm;
//       if (runType === 'Long') runKm = Math.round(thisWeekKm * 0.4);
//       else if (runType === 'Tempo') runKm = Math.round(thisWeekKm * 0.3 / (days.length - 1));
//       else runKm = Math.round((thisWeekKm - Math.round(thisWeekKm * 0.4) - Math.round(thisWeekKm * 0.3)) / (days.length - 2));

//       if (runKm > leftKm) runKm = leftKm;
//       leftKm -= runKm;

//       // Pace targets
//       let pace;
//       if (runType === 'Long') pace = initialPace + 0.5;
//       else if (runType === 'Tempo') pace = goalPace + 0.2;
//       else pace = initialPace + 0.7;

//       runs.push({
//         day: days[d],
//         type: runType,
//         distance: runKm,
//         pace: Number(pace.toFixed(2)),
//       });
//     }
//     weekPlan.push({ week: w, runs });
//   }
//   // Flatten for calendar view (add dates as needed)
//   return weekPlan.flatMap((w, i) =>
//     w.runs.map(run => ({
//       ...run,
//       week: w.week,
//       // Optionally add date logic if you want
//     }))
//   );
// }

// // API endpoint: Generate training plan
// async function generateTrainingPlan(req, res) {
//   try {
//     const {
//       userId,
//       distance: goalDistance, // frontend sends as 'distance'
//       targetTime,
//       days: preferredDays,
//       weeklyKm,
//       weeks = 12
//     } = req.body;

//     // 1. Get stats from run_data
//     const stats = await getOverallStats(userId, 8);

//     // 2. Generate plan
//     const plan = generatePlan({
//       goalDistance,
//       targetTime,
//       preferredDays,
//       weeklyKm,
//       weeks,
//       stats
//     });

//     res.json({ plan, stats });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to generate plan' });
//   }
// }

// // API endpoint: Get dashboard stats
// async function getDashboardStats(req, res) {
//   try {
//     const { userId, weeks = 8 } = req.query;
//     const stats = await getOverallStats(userId, weeks);
//     if (!stats) return res.status(404).json({ error: 'No runs found' });
//     res.json(stats);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ error: 'Failed to get stats' });
//   }
// }

// module.exports = {
//   generateTrainingPlan,
//   getDashboardStats,
// };

const pool = require('../config/db');

// Dummy stats logic for dashboard-stats (fill in as needed)
exports.getDashboardStats = async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "userId required" });
  const { rows } = await pool.query(
    `SELECT run_date, distance_km, pace, hr, cadence FROM run_data WHERE user_id = $1 ORDER BY run_date DESC LIMIT 56`, // 8 weeks
    [userId]
  );
  if (!rows.length) return res.status(404).json({ error: 'No running data' });

  // Aggregate for demo
  let weeks = [];
  for (let i = 0; i < 8; ++i) {
    const weekRows = rows.slice(i * 7, (i + 1) * 7);
    if (weekRows.length === 0) break;
    const total_km = weekRows.reduce((a, r) => a + Number(r.distance_km), 0);
    const avg_pace = weekRows.reduce((a, r) => a + Number(r.pace), 0) / weekRows.length;
    const avg_hr = weekRows.reduce((a, r) => a + (r.hr ? Number(r.hr) : 0), 0) / weekRows.length;
    const avg_cadence = weekRows.reduce((a, r) => a + (r.cadence ? Number(r.cadence) : 0), 0) / weekRows.length;
    weeks.push({
      week: `Week ${i + 1}`,
      total_km: total_km.toFixed(2),
      avg_pace: avg_pace ? avg_pace.toFixed(2) : null,
      avg_hr: avg_hr ? Math.round(avg_hr) : null,
      avg_cadence: avg_cadence ? Math.round(avg_cadence) : null,
    });
  }
  const total_km = rows.reduce((a, r) => a + Number(r.distance_km), 0);
  const avg_pace = rows.reduce((a, r) => a + Number(r.pace), 0) / rows.length;
  const avg_hr = rows.reduce((a, r) => a + (r.hr ? Number(r.hr) : 0), 0) / rows.length;
  const avg_cadence = rows.reduce((a, r) => a + (r.cadence ? Number(r.cadence) : 0), 0) / rows.length;
  res.json({
    total_km: total_km.toFixed(2),
    avg_pace: avg_pace ? avg_pace.toFixed(2) : null,
    avg_hr: avg_hr ? Math.round(avg_hr) : null,
    avg_cadence: avg_cadence ? Math.round(avg_cadence) : null,
    weeks,
  });
};

// This is the important endpoint!
exports.generateTrainingPlan = async (req, res) => {
  const { userId, category, distance, targetTime, days, weeklyKm } = req.body;
  let baselineUserId = userId;

  // Try to get data for the userId
  let { rows } = await pool.query('SELECT * FROM run_data WHERE user_id = $1 ORDER BY run_date DESC LIMIT 8', [userId]);
  if (!rows.length) {
    // Fallback: get the demo Strava user id
    const demoUser = await pool.query("SELECT id FROM users WHERE is_strava_user = true LIMIT 1");
    if (demoUser.rows.length) {
      baselineUserId = demoUser.rows[0].id;
      rows = (await pool.query('SELECT * FROM run_data WHERE user_id = $1 ORDER BY run_date DESC LIMIT 8', [baselineUserId])).rows;
    }
  }

  if (!rows.length) {
    return res.status(404).json({ success: false, error: "No running data found for training plan baseline." });
  }

  // Compute baseline
  const avgPace = rows.reduce((a, r) => a + Number(r.pace), 0) / rows.length;
  const planLengthWeeks = 8; // example: always 8 weeks
  // Dummy plan generation logic—replace with your AI or real logic
  const plan = [];
  for (let week = 1; week <= planLengthWeeks; ++week) {
    days.forEach(day => {
      plan.push({
        week,
        day,
        type: "Run",
        distance: (weeklyKm / days.length).toFixed(1),
        target_pace: (avgPace - 0.01 * week).toFixed(2)
      });
    });
  }
  res.json({ success: true, plan });
};