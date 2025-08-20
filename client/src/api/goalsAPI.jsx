//Previous code

// const API_URL = import.meta.env.VITE_API_URL;

// // Get all goals for a user
// export const getUserGoals = async (userId) => {
//   try {
//     const token = localStorage.getItem('token');
//     const response = await fetch(`${API_URL}/goals/${userId}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include'
//     });
    
//     if (!response.ok) {
//       if (response.status === 404) {
//         return { success: false, data: [], error: 'No goals found for this user.' };
//       }
//       if (response.status === 401) {
//         return { success: false, data: [], error: 'Unauthorized access. Please log in again.' };
//       }
//       throw new Error('Failed to fetch user goals');
//     }
//     const data = await response.json();
//     return { success: true, data };
//   } catch (error) {
//     console.error('Error fetching goals:', error);
//     return { success: false, data: [], error: error.message };
//   }
// };

// // Save or update a goal
// export const saveGoal = async (userId, distance, targetTime) => {
//   try {
//     const token = localStorage.getItem('token');
//     const response = await fetch(`${API_URL}/goals`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ userId, distance, targetTime }),
//       credentials: 'include'
//     });
    
//     if (!response.ok) {
//       if (response.status === 401) {
//         throw new Error('Unauthorized access. Please log in again.');
//       }
//       throw new Error('Failed to save goal');
//     }
    
//     const data = await response.json();
//     return { success: true, data };
//   } catch (error) {
//     console.error('Error saving goal:', error);
//     return { success: false, error: error.message };
//   }
// };

// const API_URL = import.meta.env.VITE_API_URL;

// // Get all goals for a user
// export const getUserGoals = async (userId) => {
//   try {
//     const token = localStorage.getItem('token');
//     const response = await fetch(`${API_URL}/goals/${userId}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include'
//     });
    
//     if (!response.ok) {
//       if (response.status === 404) {
//         return { success: false, data: [], error: 'No goals found for this user.' };
//       }
//       if (response.status === 401) {
//         return { success: false, data: [], error: 'Unauthorized access. Please log in again.' };
//       }
//       throw new Error('Failed to fetch user goals');
//     }
//     const data = await response.json();
//     return { success: true, data };
//   } catch (error) {
//     console.error('Error fetching goals:', error);
//     return { success: false, data: [], error: error.message };
//   }
// };

// // Save or update a goal
// export const saveGoal = async (userId, distance, targetTime, days = "", weeklyKm = "") => {
//   try {
//     const token = localStorage.getItem('token');
//     const response = await fetch(`${API_URL}/goals/save`, {   // <-- FIXED
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ userId, distance, targetTime, days, weeklyKm }),  // Pass extra fields if needed!
//       credentials: 'include'
//     });
    
//     if (!response.ok) {
//       if (response.status === 401) {
//         throw new Error('Unauthorized access. Please log in again.');
//       }
//       throw new Error('Failed to save goal');
//     }
    
//     const data = await response.json();
//     return { success: true, data };
//   } catch (error) {
//     console.error('Error saving goal:', error);
//     return { success: false, error: error.message };
//   }
// };


// export const saveGoal = async (userId, distance, targetTime, days = "", weeklyKm = "") => {
//   // Defensive: convert to integer or null
//   let wk = (weeklyKm === "" || weeklyKm === undefined || weeklyKm === null) ? null : parseInt(weeklyKm, 10);
//   if (isNaN(wk)) wk = null;

//   try {
//     const token = localStorage.getItem('token');
//     const response = await fetch(`${API_URL}/goals/save`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ userId, distance, targetTime, days, weeklyKm: wk }),
//       credentials: 'include'
//     });
//     if (!response.ok) {
//       if (response.status === 401) {
//         throw new Error('Unauthorized access. Please log in again.');
//       }
//       throw new Error('Failed to save goal');
//     }
//     const data = await response.json();
//     return { success: true, data };
//   } catch (error) {
//     console.error('Error saving goal:', error);
//     return { success: false, error: error.message };
//   }
// };

// const API_URL = import.meta.env.VITE_API_URL;

// // Get all goals for a user
// export const getUserGoals = async (userId) => {
//   try {
//     const token = localStorage.getItem('token');
//     const response = await fetch(`${API_URL}/goals/${userId}`, {
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       credentials: 'include'
//     });
    
//     if (!response.ok) {
//       if (response.status === 404) {
//         return { success: false, data: [], error: 'No goals found for this user.' };
//       }
//       if (response.status === 401) {
//         return { success: false, data: [], error: 'Unauthorized access. Please log in again.' };
//       }
//       throw new Error('Failed to fetch user goals');
//     }
//     const data = await response.json();
//     return { success: true, data };
//   } catch (error) {
//     console.error('Error fetching goals:', error);
//     return { success: false, data: [], error: error.message };
//   }
// };

// // Save or update a goal
// export const saveGoal = async (userId, distance, targetTime, days = "", weeklyKm = "") => {
//   // Defensive: convert weeklyKm to integer or null
//   let wk = (weeklyKm === "" || weeklyKm == null) ? null : parseInt(weeklyKm, 10);
//   if (isNaN(wk)) wk = null;

//   // Defensive: convert days to string (CSV)
//   let ds = Array.isArray(days) ? days.join(",") : days;

//   try {
//     const token = localStorage.getItem('token');
//     const response = await fetch(`${API_URL}/goals/save`, {
//       method: 'POST',
//       headers: {
//         'Authorization': `Bearer ${token}`,
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify({ userId, distance, targetTime, days: ds, weeklyKm: wk }),
//       credentials: 'include'
//     });

//     if (!response.ok) {
//       if (response.status === 401) {
//         throw new Error('Unauthorized access. Please log in again.');
//       }
//       throw new Error('Failed to save goal');
//     }

//     const data = await response.json();
//     return { success: true, data };
//   } catch (error) {
//     console.error('Error saving goal:', error);
//     return { success: false, error: error.message };
//   }
// };

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
    return data;
  } catch (error) {
    console.error('Error fetching goals:', error);
    return { success: false, data: [], error: error.message };
  }
};

// Save or update a goal
export const saveGoal = async (data2) => {
  console.log("Saving goal data:", data2); // Debugging log
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_URL}/goals/save`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data2),
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