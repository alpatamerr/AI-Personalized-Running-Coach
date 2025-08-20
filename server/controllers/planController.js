const pool = require('../config/db');
const OpenAI = require('openai');
const fs = require('fs');
const path = require('path');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Helper to get baseline run data (user or Strava demo)
const getUserBaseline = async (userId) => {
  // 8 most recent runs for pace baseline
  let runs = await pool.query(
    'SELECT * FROM run_data WHERE user_id = $1 ORDER BY run_date DESC LIMIT 8',
    [userId]
  );

  if (!runs.rows.length) {
    // Fallback: demo Strava user (flagged by is_strava_user)
    const demo = await pool.query(
      'SELECT id FROM users WHERE is_strava_user = true LIMIT 1'
    );
    if (demo.rows.length) {
      runs = await pool.query(
        'SELECT * FROM run_data WHERE user_id = $1 ORDER BY run_date DESC LIMIT 8',
        [demo.rows[0].id]
      );
    }
  }
  return runs.rows;
};

// Build a short system‑prompt for GPT from DB values
const buildSystemPrompt = ({
    username,
    goalDistance,
    goalTime,
    runDays,
    weeklyDistance,
    avgPace,
  }) => {
    /*
      GPT is told to return **only JSON** so the controller can JSON.parse it safely.
    */
   
    return `You are an expert running coach.
  Create an 16‑week periodised running plan for the athlete below.
  Return the answer **as raw JSON** – an array where each element has:
    week  (int, 1‑16),
    day   (string, e.g. "Monday"),
    type  (string, e.g. "Long Run", "Tempo", "Intervals", "Easy", "Rest"),
    distance_km (number, one decimal),
    target_pace (number, minutes per km with two decimals),
    notes (string, optional, e.g. "Focus on form", "Hydrate well"),
    explaination (string, optional, e.g. "Long run to build endurance").
  Do NOT wrap the JSON in markdown or commentary.

  Runner profile
  --------------
  Name              : ${username}
  Goal distance      : ${goalDistance}
  Target time        : ${goalTime}
  Preferred run days : ${runDays.join(', ')}
  Weekly distance aim: ${weeklyDistance} km
  Current easy‑run pace: ${avgPace.toFixed(2)} min/km

  Rules
  -----
  • Use 3‑week build + 1‑week deload structure.
  • Keep weekly km increases ≤ 10 %.
  • Each week must include at least one rest day.
  • Long run happens on the last weekend day in runDays.
    `;
};

// --- Generate Training Plan using GPT ---
exports.generateTrainingPlan = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId required' });
    }

    // 1. Fetch user info + goal -------------------------------------------
    const userRes = await pool.query('SELECT username FROM users WHERE id = $1', [userId]);
    const username = userRes.rows.length ? userRes.rows[0].username : 'Athlete';

    const { rows: goals } = await pool.query(
      'SELECT * FROM goals WHERE user_id = $1 ORDER BY updated_at DESC LIMIT 1',
      [userId]
    );
    if (!goals.length) {
      return res.status(404).json({ success: false, error: 'No goal found for user' });
    }
    const goal = goals[0];

    // Parse runDays and weeklyDistance from goal record (fallback defaults)
    const runDays = goal.days ? goal.days.split(',') : ['Monday', 'Wednesday', 'Friday', 'Saturday'];
    const weeklyDistance = goal.weekly_km ? Number(goal.weekly_km) : 40;

    // 2. Baseline metrics ----------------------------------------------------
    const runs = await getUserBaseline(userId);
    const avgPace = runs.length
      ? runs.reduce((sum, r) => sum + Number(r.pace), 0) / runs.length
      : 6.0; // default 6 min/km if no data

    // 3. Build GPT prompts ---------------------------------------------------
    const systemPrompt = buildSystemPrompt({
      username,
      goalDistance: goal.distance,
      goalTime: goal.target_time,
      runDays,
      weeklyDistance,
      avgPace,
    });

    const userPrompt = 'Generate the plan now for 16 weeks.';

    // 4. Call OpenAI ---------------------------------------------------------
    let gptPlan;
    try {

      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const response = await openai.responses.create({
        model: "gpt-4.1-nano",
        input: [
          {
            "role": "system",
            "content": [
              {
                "type": "input_text",
                "text": systemPrompt
              }
            ]
          },
          {
            "role": "user",
            "content": [
              {
                "type": "input_text",
                "text": userPrompt
              }
            ]
          }
        ],
        text: {
          "format": {
            "type": "text"
          }
        },
      });
      console.log('OpenAI response:', response);
      const completion = response.output;
      console.log('Raw GPT completion:', completion);
      console.log('GPT completion:', completion[0]['content'][0]['text']);
      const plansDir = path.join(__dirname, '..', 'plans');
      if (!fs.existsSync(plansDir)) {
        fs.mkdirSync(plansDir, { recursive: true });
      }
      const planFilePath = path.join(plansDir, `plan_${userId}_${Date.now()}.json`);
      fs.writeFileSync(planFilePath, completion[0]['content'][0]['text'], 'utf8');
      // Response should be just JSON text
      const client = await pool.connect();
      try {
        // Insert into training_plans
        const startDate = new Date();
        const endDate = new Date();
        endDate.setDate(startDate.getDate() + 7 * 16); // 16 weeks
        const planInsertRes = await client.query(
          `INSERT INTO training_plans (user_id, goal, start_date, end_date)
           VALUES ($1, $2, $3, $4) RETURNING id`,
          [
            userId,
            `${goal.distance}km in ${goal.target_time}`,
            startDate.toISOString().slice(0, 10),
            endDate.toISOString().slice(0, 10)
          ]
        );
        const trainingPlanId = planInsertRes.rows[0].id;
        gptPlan = JSON.parse(completion[0]['content'][0]['text']);
        // Insert each day into plan_details
        for (const entry of gptPlan) {
          await client.query(
            `INSERT INTO plan_details
              (training_plan_id, week, day, type, distance, target_pace, note, explanation)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [
              trainingPlanId,
              entry.week,
              entry.day,
              entry.type,
              entry.distance_km,
              entry.target_pace,
              entry.notes || null,
              entry.explanation || null
            ]
          );
        }
      } finally {
        client.release();
      }
      gptPlan = JSON.parse(completion[0]['content'][0]['text']);
      console.log('Parsed GPT plan:', gptPlan);
    } catch (gptErr) {
      console.error('OpenAI error:', gptErr);
      return res.status(502).json({ success: false, error: 'AI service failed', details: gptErr.message });
    }

    // 5. Persist plan into training_plans table (optional – here we just return)
    // In real app you might INSERT rows.  For now send back to client.

    return res.json({ success: true, plan: gptPlan });
  } catch (err) {
    console.error('Error generating plan:', err);
    return res.status(500).json({ success: false, error: 'Failed to generate plan', details: err.message });
  }
};

// --- Get Training Plan for user -------------------------------------------
exports.getTrainingPlan = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({ success: false, error: 'userId required' });
    }
    const { rows } = await pool.query(
      'SELECT * FROM training_plans WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1',
      [userId]
    );
    if (!rows.length) {
      return res.status(404).json({ success: false, error: 'No training plan found for user' });
    }
    const plan = rows[0];
    let planData;
    try {
      const { rows: details } = await pool.query(
      'SELECT week, day, type, distance, target_pace, note, explanation FROM plan_details WHERE training_plan_id = $1 ORDER BY week, day',
      [plan.id]
      );
      planData = details;
    } catch (parseErr) {
      console.error('Failed to parse plan JSON:', parseErr);
      return res.status(500).json({ success: false, error: 'Invalid plan format', details: parseErr.message });
    }
    return res.json({ success: true, plan: { ...plan, details: planData } });
  } catch (err) {
    console.error('Error fetching training plan:', err);
    return res.status(500).json({ success: false, error: 'Failed to fetch training plan', details: err.message });
  }
};
// --- Dashboard stats: unchanged -------------------------------------------
exports.getDashboardStats = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ error: 'userId required' });

    const { rows } = await pool.query(
      `SELECT run_date, distance_km, pace, average_heartrate, average_cadence
       FROM run_data
       WHERE user_id = $1
       ORDER BY run_date DESC
       LIMIT 56`,
      [userId]
    );

    // Aggregate by week (same logic as before)
    const weeks = [];
    for (let i = 0; i < 8; i++) {
      const weekRows = rows.slice(i * 7, (i + 1) * 7);
      if (!weekRows.length) break;

      const total_km = weekRows.reduce((sum, r) => sum + (Number(r.distance_km) || 0), 0);
      const avg_pace = weekRows.length ? weekRows.reduce((s, r) => s + (Number(r.pace) || 0), 0) / weekRows.length : null;
      const avg_hr = weekRows.length ? weekRows.reduce((s, r) => s + (r.average_heartrate ? Number(r.average_heartrate) : 0), 0) / weekRows.length : null;
      const avg_cadence = weekRows.length ? weekRows.reduce((s, r) => s + (r.average_cadence ? Number(r.average_cadence) : 0), 0) / weekRows.length : null;

      weeks.push({
        week: `Week ${i + 1}`,
        total_km: total_km.toFixed(2),
        avg_pace: avg_pace ? avg_pace.toFixed(2) : null,
        avg_hr: avg_hr ? Math.round(avg_hr) : null,
        avg_cadence: avg_cadence ? Math.round(avg_cadence) : null,
      });
    }

    // Totals across all 56 days
    const total_km = rows.reduce((s, r) => s + (Number(r.distance_km) || 0), 0);
    const avg_pace = rows.length ? rows.reduce((s, r) => s + (Number(r.pace) || 0), 0) / rows.length : null;
    const avg_hr = rows.length ? rows.reduce((s, r) => s + (r.average_heartrate ? Number(r.average_heartrate) : 0), 0) / rows.length : null;
    const avg_cadence = rows.length ? rows.reduce((s, r) => s + (r.average_cadence ? Number(r.average_cadence) : 0), 0) / rows.length : null;

    res.json({
      total_km: total_km.toFixed(2),
      avg_pace: avg_pace ? avg_pace.toFixed(2) : null,
      avg_hr: avg_hr ? Math.round(avg_hr) : null,
      avg_cadence: avg_cadence ? Math.round(avg_cadence) : null,
      weeks,
    });
  } catch (err) {
    console.error('Dashboard stats error:', err);
    res.status(500).json({ error: 'Failed to load dashboard stats', details: err.message });
  }
};
