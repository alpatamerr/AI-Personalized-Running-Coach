// const pool = require('../config/db');

// // Middleware for validating goal input
// const validateGoalInput = (req, res, next) => {
//   const { userId, distance, targetTime } = req.body;

//   // Validate userId
//   if (!userId || isNaN(userId) || userId <= 0) {
//     return res.status(400).json({ success: false, error: 'Invalid user ID' });
//   }

//   // Validate distance
//   const validDistances = ['5K', '10K', 'Half Marathon', 'Full Marathon'];
//   if (!distance || !validDistances.includes(distance)) {
//     return res.status(400).json({ success: false, error: 'Invalid distance value' });
//   }

//   // Validate targetTime (accepts HH:MM:SS or MM:SS format)
//   const timeRegex = /^(\d{2}:)?\d{2}:\d{2}$/;
//   if (!targetTime || !timeRegex.test(targetTime)) {
//     return res.status(400).json({ success: false, error: 'Invalid target time format (use HH:MM:SS or MM:SS)' });
//   }

//   next();
// };

// // Get all goals for a user
// const getUserGoals = async (req, res) => {
//   const { userId } = req.params;

//   if (!userId) {
//     return res.status(400).json({ 
//       success: false, 
//       error: 'User ID is required' 
//     });
//   }

//   try {
//     const result = await pool.query(
//       'SELECT distance, target_time as "targetTime" FROM goals WHERE user_id = $1',
//       [userId]
//     );

//     if (result.rows.length === 0) {
//       return res.status(200).json({
//         success: true,
//         data: [],
//         message: 'No goals found for this user'
//       });
//     }

//     return res.json({
//       success: true,
//       data: result.rows
//     });
//   } catch (error) {
//     console.error('Error fetching goals:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Failed to fetch goals'
//     });
//   }
// };

// const saveOrUpdateGoal = async (req, res) => {
//   const { userId, distance, targetTime } = req.body;

//   if (!userId || !distance || !targetTime) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     // Check if goal already exists
//     const existingGoal = await pool.query(
//       'SELECT * FROM goals WHERE user_id = $1 AND distance = $2',
//       [userId, distance]
//     );

//     if (existingGoal.rows.length > 0) {
//       // Update existing goal
//       await pool.query(
//         'UPDATE goals SET target_time = $1, updated_at = NOW() WHERE user_id = $2 AND distance = $3',
//         [targetTime, userId, distance]
//       );
//     } else {
//       // Insert new goal
//       await pool.query(
//         'INSERT INTO goals (user_id, distance, target_time) VALUES ($1, $2, $3)',
//       [userId, distance, targetTime]
//     );
//     }

//     res.status(200).json({ message: 'Goal saved successfully' });
//   } catch (error) {
//     console.error('Error saving goal:', error);
//     res.status(500).json({ message: 'Error saving goal' });
//   }
// };

// // Add this function:
// const deleteGoal = async (req, res) => {
//   const { userId, distance } = req.params;
//   if (!userId || !distance) {
//     return res.status(400).json({ success: false, error: 'User ID and distance are required' });
//   }
//   try {
//     await pool.query(
//       'DELETE FROM goals WHERE user_id = $1 AND distance = $2',
//       [userId, distance]
//     );
//     return res.json({ success: true, message: 'Goal deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting goal:', error);
//     return res.status(500).json({ success: false, error: 'Failed to delete goal' });
//   }
// };

// module.exports = { getUserGoals, saveOrUpdateGoal, validateGoalInput, deleteGoal };

// const pool = require('../config/db');

// // Save or update goal: now also saves days and weekly_km!
// const saveOrUpdateGoal = async (req, res) => {
//   const { userId, distance, targetTime, days, weeklyKm } = req.body;

//   if (!userId || !distance || !targetTime) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   try {
//     // Check if goal already exists for user+distance (you can adjust this as needed)
//     const existingGoal = await pool.query(
//       'SELECT * FROM goals WHERE user_id = $1 AND distance = $2',
//       [userId, distance]
//     );

//     if (existingGoal.rows.length > 0) {
//       // Update (also update days, weekly_km)
//       await pool.query(
//         'UPDATE goals SET target_time = $1, days = $2, weekly_km = $3, updated_at = NOW() WHERE user_id = $4 AND distance = $5',
//         [targetTime, days, weeklyKm, userId, distance]
//       );
//     } else {
//       // Insert
//       await pool.query(
//         'INSERT INTO goals (user_id, distance, target_time, days, weekly_km) VALUES ($1, $2, $3, $4, $5)',
//         [userId, distance, targetTime, days, weeklyKm]
//       );
//     }

//     res.status(200).json({ message: 'Goal saved successfully' });
//   } catch (error) {
//     console.error('Error saving goal:', error);
//     res.status(500).json({ message: 'Error saving goal' });
//   }
// };

// // Get all goals for a user (returns days and weekly_km too)
// const getUserGoals = async (req, res) => {
//   const { userId } = req.params;

//   if (!userId) {
//     return res.status(400).json({ 
//       success: false, 
//       error: 'User ID is required' 
//     });
//   }

//   try {
//     const result = await pool.query(
//       'SELECT distance, target_time as "targetTime", days, weekly_km FROM goals WHERE user_id = $1',
//       [userId]
//     );

//     if (result.rows.length === 0) {
//       return res.status(200).json({
//         success: true,
//         data: [],
//         message: 'No goals found for this user'
//       });
//     }

//     return res.json({
//       success: true,
//       data: result.rows
//     });
//   } catch (error) {
//     console.error('Error fetching goals:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Failed to fetch goals'
//     });
//   }
// };

// module.exports = { getUserGoals, saveOrUpdateGoal };

// const pool = require('../config/db');

// // Save or update goal: now also saves days and weekly_km!
// const saveOrUpdateGoal = async (req, res) => {
//   const { userId, distance, targetTime, days, weeklyKm } = req.body;

//   if (!userId || !distance || !targetTime) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   // Convert empty string or invalid to null for weeklyKm
//   let weeklyKmInt = null;
//   if (weeklyKm !== undefined && weeklyKm !== null && weeklyKm !== "") {
//     weeklyKmInt = parseInt(weeklyKm, 10);
//     if (isNaN(weeklyKmInt)) weeklyKmInt = null;
//   }

//   try {
//     // Check if goal already exists for user+distance
//     const existingGoal = await pool.query(
//       'SELECT * FROM goals WHERE user_id = $1 AND distance = $2',
//       [userId, distance]
//     );

//     if (existingGoal.rows.length > 0) {
//       // Update (also update days, weekly_km)
//       await pool.query(
//         'UPDATE goals SET target_time = $1, days = $2, weekly_km = $3, updated_at = NOW() WHERE user_id = $4 AND distance = $5',
//         [targetTime, days, weeklyKmInt, userId, distance]
//       );
//     } else {
//       // Insert
//       await pool.query(
//         'INSERT INTO goals (user_id, distance, target_time, days, weekly_km) VALUES ($1, $2, $3, $4, $5)',
//         [userId, distance, targetTime, days, weeklyKmInt]
//       );
//     }

//     res.status(200).json({ message: 'Goal saved successfully' });
//   } catch (error) {
//     console.error('Error saving goal:', error);
//     res.status(500).json({ message: 'Error saving goal' });
//   }
// };

// const getUserGoals = async (req, res) => {
//   const { userId } = req.params;

//   if (!userId) {
//     return res.status(400).json({ 
//       success: false, 
//       error: 'User ID is required' 
//     });
//   }

//   try {
//     const result = await pool.query(
//       'SELECT distance, target_time as "targetTime", days, weekly_km FROM goals WHERE user_id = $1',
//       [userId]
//     );

//     if (result.rows.length === 0) {
//       return res.status(200).json({
//         success: true,
//         data: [],
//         message: 'No goals found for this user'
//       });
//     }

//     return res.json({
//       success: true,
//       data: result.rows
//     });
//   } catch (error) {
//     console.error('Error fetching goals:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Failed to fetch goals'
//     });
//   }
// };

// module.exports = { getUserGoals, saveOrUpdateGoal };

// const pool = require('../config/db');

// // Save or update a goal (with days & weekly_km)
// const saveOrUpdateGoal = async (req, res) => {
//   const { userId, distance, targetTime, days, weeklyKm } = req.body;

//   if (!userId || !distance || !targetTime) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   // Defensive: convert weeklyKm to integer or null
//   let weeklyKmInt = null;
//   if (weeklyKm !== undefined && weeklyKm !== null && weeklyKm !== "") {
//     weeklyKmInt = parseInt(weeklyKm, 10);
//     if (isNaN(weeklyKmInt)) weeklyKmInt = null;
//   }

//   // Defensive: convert days to string (CSV)
//   let daysStr = days;
//   if (Array.isArray(days)) daysStr = days.join(',');
//   if (daysStr === undefined || daysStr === null) daysStr = "";

//   try {
//     // Check if goal already exists
//     const existingGoal = await pool.query(
//       'SELECT * FROM goals WHERE user_id = $1 AND distance = $2',
//       [userId, distance]
//     );

//     if (existingGoal.rows.length > 0) {
//       // Update
//       await pool.query(
//         'UPDATE goals SET target_time = $1, days = $2, weekly_km = $3, updated_at = NOW() WHERE user_id = $4 AND distance = $5',
//         [targetTime, daysStr, weeklyKmInt, userId, distance]
//       );
//     } else {
//       // Insert
//       await pool.query(
//         'INSERT INTO goals (user_id, distance, target_time, days, weekly_km) VALUES ($1, $2, $3, $4, $5)',
//         [userId, distance, targetTime, daysStr, weeklyKmInt]
//       );
//     }

//     res.status(200).json({ message: 'Goal saved successfully' });
//   } catch (error) {
//     console.error('Error saving goal:', error);
//     res.status(500).json({ message: 'Error saving goal' });
//   }
// };

// // Get all goals for a user (returns all fields)
// const getUserGoals = async (req, res) => {
//   const { userId } = req.params;

//   if (!userId) {
//     return res.status(400).json({ 
//       success: false, 
//       error: 'User ID is required' 
//     });
//   }

//   try {
//     const result = await pool.query(
//       'SELECT distance, target_time as "targetTime", days, weekly_km FROM goals WHERE user_id = $1',
//       [userId]
//     );

//     if (result.rows.length === 0) {
//       return res.status(200).json({
//         success: true,
//         data: [],
//         message: 'No goals found for this user'
//       });
//     }

//     return res.json({
//       success: true,
//       data: result.rows
//     });
//   } catch (error) {
//     console.error('Error fetching goals:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Failed to fetch goals'
//     });
//   }
// };

// module.exports = { getUserGoals, saveOrUpdateGoal };

// const pool = require('../config/db');

// // Save or update a goal (with days & weekly_km)
// const saveOrUpdateGoal = async (req, res) => {
//   const { userId, distance, targetTime, days, weeklyKm } = req.body;

//   // 1. Log the raw incoming data
//   console.log('[saveOrUpdateGoal] Incoming data:', { userId, distance, targetTime, days, weeklyKm });

//   if (!userId || !distance || !targetTime) {
//     return res.status(400).json({ message: 'Missing required fields' });
//   }

//   // Defensive: convert weeklyKm to integer or null
//   let weeklyKmInt = null;
//   if (weeklyKm !== undefined && weeklyKm !== null && weeklyKm !== "") {
//     weeklyKmInt = parseInt(weeklyKm, 10);
//     if (isNaN(weeklyKmInt)) weeklyKmInt = null;
//   }

//   // Defensive: convert days to string (CSV)
//   let daysStr = days;
//   if (Array.isArray(days)) daysStr = days.join(',');
//   if (daysStr === undefined || daysStr === null) daysStr = "";

//   // 2. Log the processed values you will send to the DB
//   console.log('[saveOrUpdateGoal] Processed for DB:', { daysStr, weeklyKmInt });

//   try {
//     // Check if goal already exists
//     const existingGoal = await pool.query(
//       'SELECT * FROM goals WHERE user_id = $1 AND distance = $2',
//       [userId, distance]
//     );

//     if (existingGoal.rows.length > 0) {
//       // Update
//       await pool.query(
//         'UPDATE goals SET target_time = $1, days = $2, weekly_km = $3, updated_at = NOW() WHERE user_id = $4 AND distance = $5',
//         [targetTime, daysStr, weeklyKmInt, userId, distance]
//       );
//     } else {
//       // Insert
//       await pool.query(
//         'INSERT INTO goals (user_id, distance, target_time, days, weekly_km) VALUES ($1, $2, $3, $4, $5)',
//         [userId, distance, targetTime, daysStr, weeklyKmInt]
//       );
//     }

//     res.status(200).json({ message: 'Goal saved successfully' });
//   } catch (error) {
//     console.error('Error saving goal:', error);
//     res.status(500).json({ message: 'Error saving goal' });
//   }
// };

// // Get all goals for a user (returns all fields)
// const getUserGoals = async (req, res) => {
//   const { userId } = req.params;

//   if (!userId) {
//     return res.status(400).json({ 
//       success: false, 
//       error: 'User ID is required' 
//     });
//   }

//   try {
//     const result = await pool.query(
//       'SELECT distance, target_time as "targetTime", days, weekly_km FROM goals WHERE user_id = $1',
//       [userId]
//     );

//     if (result.rows.length === 0) {
//       return res.status(200).json({
//         success: true,
//         data: [],
//         message: 'No goals found for this user'
//       });
//     }

//     return res.json({
//       success: true,
//       data: result.rows
//     });
//   } catch (error) {
//     console.error('Error fetching goals:', error);
//     return res.status(500).json({
//       success: false,
//       error: 'Failed to fetch goals'
//     });
//   }
// };

// module.exports = { getUserGoals, saveOrUpdateGoal };

const pool = require('../config/db');

// Save or update a goal (with days & weekly_km)
const saveOrUpdateGoal = async (req, res) => {
  const { userId, distance, targetTime, days, weeklyKm } = req.body;

  // 1. Log the raw incoming data
  console.log('[saveOrUpdateGoal] Incoming data:', { userId, distance, targetTime, days, weeklyKm });

  if (!userId || !distance || !targetTime) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  // Defensive: convert weeklyKm to integer or null
  let weeklyKmInt = null;
  if (weeklyKm !== undefined && weeklyKm !== null && weeklyKm !== "") {
    weeklyKmInt = parseInt(weeklyKm, 10);
    if (isNaN(weeklyKmInt)) weeklyKmInt = null;
  }

  // Defensive: convert days to string (CSV)
  let daysStr = "";
  if (Array.isArray(days)) daysStr = days.join(',');
  else if (typeof days === "string") daysStr = days;
  if (daysStr === undefined || daysStr === null) daysStr = "";

  // 2. Log the processed values you will send to the DB
  console.log('[saveOrUpdateGoal] Processed for DB:', { daysStr, weeklyKmInt });

  try {
    // Check if goal already exists
    const existingGoal = await pool.query(
      'SELECT * FROM goals WHERE user_id = $1 AND distance = $2',
      [userId, distance]
    );

    if (existingGoal.rows.length > 0) {
      // Update
      await pool.query(
        'UPDATE goals SET target_time = $1, days = $2, weekly_km = $3, updated_at = NOW() WHERE user_id = $4 AND distance = $5',
        [targetTime, daysStr, weeklyKmInt, userId, distance]
      );
    } else {
      // Insert
      await pool.query(
        'INSERT INTO goals (user_id, distance, target_time, days, weekly_km) VALUES ($1, $2, $3, $4, $5)',
        [userId, distance, targetTime, daysStr, weeklyKmInt]
      );
    }

    res.status(200).json({ message: 'Goal saved successfully' });
  } catch (error) {
    console.error('Error saving goal:', error);
    res.status(500).json({ message: 'Error saving goal' });
  }
};

// Get all goals for a user (returns all fields)
const getUserGoals = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ 
      success: false, 
      error: 'User ID is required' 
    });
  }

  try {
    const result = await pool.query(
      'SELECT distance, target_time as "targetTime", days, weekly_km FROM goals WHERE user_id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: 'No goals found for this user'
      });
    }

    return res.json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching goals:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch goals'
    });
  }
};
const deleteGoal = async (req, res) => {
  const { userId, distance } = req.params;
  if (!userId || !distance) {
    return res.status(400).json({ success: false, error: 'User ID and distance are required' });
  }
  try {
    await pool.query(
      'DELETE FROM goals WHERE user_id = $1 AND distance = $2',
      [userId, distance]
    );
    return res.json({ success: true, message: 'Goal deleted successfully' });
  } catch (error) {
    console.error('Error deleting goal:', error);
    return res.status(500).json({ success: false, error: 'Failed to delete goal' });
  }
};
module.exports = { getUserGoals, saveOrUpdateGoal, deleteGoal };