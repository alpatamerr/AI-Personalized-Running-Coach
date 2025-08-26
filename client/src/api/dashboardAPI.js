// Dashboard API functions
import { API_URL } from '../config';

// Get Strava user ID
export const getStravaUserId = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/plans/strava-user-id`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch Strava user ID');
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching Strava user ID:', error);
    return { success: false, error: error.message };
  }
};

// Get dashboard stats
export const getDashboardStats = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/plans/dashboard-stats?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }
    
    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return { success: false, error: error.message };
  }
};

// Get recent activities
export const getRecentActivities = async (userId) => {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/plans/recent-activities?userId=${userId}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch recent activities');
    }
    
    const data = await response.json();
    return { success: true, data: data.activities || [] };
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    return { success: false, data: [], error: error.message };
  }
};
