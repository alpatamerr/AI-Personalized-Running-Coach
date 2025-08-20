// const express = require('express');
// const { saveOrUpdateGoal, getUserGoals, deleteGoal } = require('../controllers/goalController');
// const router = express.Router();

// // Save or update a goal
// router.post('/', saveOrUpdateGoal);

// // Get user's goals
// router.get('/:userId', getUserGoals);

// router.delete('/:userId/:distance', deleteGoal);

// module.exports = router;

// const express = require('express');
// const { getUserGoals, saveOrUpdateGoal } = require('../controllers/goalController');

// const router = express.Router();

// // Save or update a goal
// router.post('/save', saveOrUpdateGoal);

// // Get all goals for a user
// router.get('/:userId', getUserGoals);

// module.exports = router;

// const express = require('express');
// const { getUserGoals, saveOrUpdateGoal } = require('../controllers/goalController');

// const router = express.Router();

// // Save or update a goal
// router.post('/save', saveOrUpdateGoal);

// // Get all goals for a user
// router.get('/:userId', getUserGoals);

// module.exports = router;

const express = require('express');
const { getUserGoals, saveOrUpdateGoal, deleteGoal } = require('../controllers/goalController');

const router = express.Router();

// Save or update a goal
router.post('/save', saveOrUpdateGoal);

// Get all goals for a user
router.get('/:userId', getUserGoals);
// Delete a goal
router.delete('/:userId/:distance', deleteGoal);

module.exports = router;