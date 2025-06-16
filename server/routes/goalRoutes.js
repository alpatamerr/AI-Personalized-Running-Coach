const express = require('express');
const { saveOrUpdateGoal, getUserGoals, deleteGoal } = require('../controllers/goalController');
const router = express.Router();

// Save or update a goal
router.post('/', saveOrUpdateGoal);

// Get user's goals
router.get('/:userId', getUserGoals);

router.delete('/:userId/:distance', deleteGoal);

module.exports = router;