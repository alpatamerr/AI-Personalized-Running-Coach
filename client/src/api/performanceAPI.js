// API for saving and fetching run performance for a user's plan day
const API_URL = import.meta.env.VITE_API_URL;

export const saveRunPerformance = async (userId, week, day, data) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/plans/save-performance`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId, week, day, ...data }),
      credentials: 'include'
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Unauthorized access. Please log in again.');
      }
      throw new Error('Failed to save performance');
    }
    const result = await response.json();
    return { success: true, data: result };
  } catch (error) {
    console.error('Error saving performance:', error);
    return { success: false, error: error.message };
  }
};

export const getRunPerformance = async (userId, week, day) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/plans/get-performance?userId=${userId}&week=${week}&day=${day}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, data: null };
      }
      throw new Error('Failed to fetch performance');
    }
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching performance:', error);
    return { success: false, error: error.message };
  }
};
