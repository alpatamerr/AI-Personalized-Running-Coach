import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserGoals, saveGoal } from '../api/goalsAPI';
import '../styles/GoalSettingPage.css';

const GoalSettingPage = () => {
  const navigate = useNavigate();
  const [goals, setGoals] = useState({
    '5K': '',
    '10K': '',
    'Half Marathon': '',
    'Full Marathon': ''
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingGoals, setExistingGoals] = useState([]);

  useEffect(() => {
    const fetchExistingGoals = async () => {
      const userId = localStorage.getItem('userId');
      if (!userId) {
        navigate('/login');
        return;
      }
      
      const result = await getUserGoals(userId);
      if (result.success && result.data.length > 0) {
        const goalsObj = {};
        result.data.forEach(goal => {
          goalsObj[goal.distance] = goal.targetTime;
        });
        setGoals(prevGoals => ({ ...prevGoals, ...goalsObj }));
        setExistingGoals(result.data);
      }
    };

    fetchExistingGoals();
  }, [navigate]);

  const handleInputChange = (distance, value) => {
    setGoals(prevGoals => ({
      ...prevGoals,
      [distance]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setIsError(false);

    const userId = localStorage.getItem('userId');
    if (!userId) {
      setIsError(true);
      setMessage('Please log in to set goals');
      setIsSubmitting(false);
      return;
    }

    // Check if at least one goal is set
    const hasGoals = Object.values(goals).some(goal => goal !== '');
    if (!hasGoals) {
      setIsError(true);
      setMessage('Please set at least one goal');
      setIsSubmitting(false);
      return;
    }

    try {
      // Save each goal that has a value
      const savePromises = Object.entries(goals)
        .filter(([_, targetTime]) => targetTime !== '')
        .map(([distance, targetTime]) => 
          saveGoal(userId, distance, targetTime)
        );

      const results = await Promise.all(savePromises);
      
      // Check if any saves failed
      const hasErrors = results.some(result => !result.success);
      
      if (hasErrors) {
        setIsError(true);
        setMessage('Some goals failed to save. Please try again.');
      } else {
      setMessage('Goals saved successfully!');
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (error) {
      setIsError(true);
      setMessage(error.message || 'Failed to save goals. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="goal-setting-container">
      <h1>Set Your Running Goals</h1>
      <p className="subtitle">Enter your target times for the distances you want to achieve</p>
      
      <form onSubmit={handleSubmit} className="goal-form">
        {Object.keys(goals).map((distance) => (
          <div key={distance} className="goal-input-group">
            <label htmlFor={distance}>{distance}</label>
              <input
                type="text"
              id={distance}
                value={goals[distance]}
                onChange={(e) => handleInputChange(distance, e.target.value)}
              placeholder="HH:MM:SS"
              pattern="^(?:(?:([01]?\d|2[0-3]):)?([0-5]?\d):)?([0-5]?\d)$"
              title="Please enter time in HH:MM:SS format"
              />
          </div>
        ))}
        
        <div className="message-container">
          {message && (
            <p className={isError ? 'error-message' : 'success-message'}>
              {message}
            </p>
          )}
        </div>

        <button 
          type="submit" 
          className="submit-button"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving...' : 'Save Goals'}
        </button>
      </form>
    </div>
  );
};

export default GoalSettingPage;