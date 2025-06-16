const axios = require('axios');

async function generatePlanWithAI(userStats) {
  // Adjust the URL if your AI service runs on a different host/port
  const response = await axios.post('http://localhost:8000/generate_plan', userStats);
  // AI returns { runs: [...] }
  return response.data.runs || [];
}

module.exports = { generatePlanWithAI };


