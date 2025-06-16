const API_URL = import.meta.env.VITE_API_URL;

// Get all goals for a user
export const getUserGoals = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/goals/${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, data: [], error: 'No goals found for this user.' };
      }
      if (response.status === 401) {
        return { success: false, data: [], error: 'Unauthorized access. Please log in again.' };
      }
      throw new Error('Failed to fetch user goals');
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching goals:', error);
    return { success: false, data: [], error: error.message };
  }
};

// Save or update a goal
export const saveGoal = async (userId, distance, targetTime) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/goals`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, distance, targetTime }),
      credentials: 'include'
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized access. Please log in again.');
      }
      throw new Error('Failed to save goal');
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error saving goal:', error);
    return { success: false, error: error.message };
  }
};