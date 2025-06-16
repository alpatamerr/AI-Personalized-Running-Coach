const pool = require('../config/db');

// Middleware for validating goal input
const validateGoalInput = (req, res, next) => {
  const { userId, distance, targetTime } = req.body;

  // Validate userId
  if (!userId || isNaN(userId) || userId <= 0) {
    return res.status(400).json({ success: false, error: 'Invalid user ID' });
  }

  // Validate distance
  const validDistances = ['5K', '10K', 'Half Marathon', 'Full Marathon'];
  if (!distance || !validDistances.includes(distance)) {
    return res.status(400).json({ success: false, error: 'Invalid distance value' });
  }

  // Validate targetTime (accepts HH:MM:SS or MM:SS format)
  const timeRegex = /^(\d{2}:)?\d{2}:\d{2}$/;
  if (!targetTime || !timeRegex.test(targetTime)) {
    return res.status(400).json({ success: false, error: 'Invalid target time format (use HH:MM:SS or MM:SS)' });
  }

  next();
};

// Get all goals for a user
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
      'SELECT distance, target_time as "targetTime" FROM goals WHERE user_id = $1',
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

const saveOrUpdateGoal = async (req, res) => {
  const { userId, distance, targetTime } = req.body;

  if (!userId || !distance || !targetTime) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    // Check if goal already exists
    const existingGoal = await pool.query(
      'SELECT * FROM goals WHERE user_id = $1 AND distance = $2',
      [userId, distance]
    );

    if (existingGoal.rows.length > 0) {
      // Update existing goal
      await pool.query(
        'UPDATE goals SET target_time = $1, updated_at = NOW() WHERE user_id = $2 AND distance = $3',
        [targetTime, userId, distance]
      );
    } else {
      // Insert new goal
      await pool.query(
        'INSERT INTO goals (user_id, distance, target_time) VALUES ($1, $2, $3)',
      [userId, distance, targetTime]
    );
    }

    res.status(200).json({ message: 'Goal saved successfully' });
  } catch (error) {
    console.error('Error saving goal:', error);
    res.status(500).json({ message: 'Error saving goal' });
  }
};

// Add this function:
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

module.exports = { getUserGoals, saveOrUpdateGoal, validateGoalInput, deleteGoal };