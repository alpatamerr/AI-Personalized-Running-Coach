import React, { useState, useEffect } from 'react';
import { getUserGoals, saveGoal } from '../api/goalsAPI.jsx';

const GoalSurveyForm = ({ userId }) => {
  const [selectedDistance, setSelectedDistance] = useState('');
  const [targetTime, setTargetTime] = useState('');
  const [existingGoals, setExistingGoals] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: '', text: '' });

  const distances = ['5K', '10K', 'Half Marathon', 'Full Marathon'];

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await getUserGoals(userId);
        if (response.success && response.data) {
          const goalsMap = {};
          response.data.forEach((goal) => {
            goalsMap[goal.distance] = goal.target_time;
          });
          setExistingGoals(goalsMap);
        } else if (response.error) {
          setMessage({ type: 'error', text: response.error });
        }
      } catch (err) {
        console.error('Error fetching user goals:', err);
        setMessage({ type: 'error', text: 'Failed to load goals. Please try again.' });
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
    fetchGoals();
    }
  }, [userId]);

  const handleDistanceSelect = (distance) => {
    setSelectedDistance(distance);
    setTargetTime(existingGoals[distance] || '');
    setMessage({ type: '', text: '' });
  };

  const handleSaveGoal = async () => {
    if (!selectedDistance || targetTime.trim() === '') {
      setMessage({ type: 'error', text: 'Please select a distance and enter a valid target time.' });
      return;
    }

    // Validate time format (HH:MM:SS or MM:SS)
    const timeRegex = /^(\d{2}:)?\d{2}:\d{2}$/;
    if (!timeRegex.test(targetTime)) {
      setMessage({ type: 'error', text: 'Please enter time in HH:MM:SS or MM:SS format.' });
      return;
    }

    try {
      const response = await saveGoal(userId, selectedDistance, targetTime);
      if (response.success) {
      setExistingGoals((prevGoals) => ({
        ...prevGoals,
        [selectedDistance]: targetTime,
      }));
        setMessage({ type: 'success', text: 'Goal saved successfully!' });
      setSelectedDistance('');
      setTargetTime('');
      } else {
        setMessage({ type: 'error', text: response.error || 'Failed to save goal.' });
      }
    } catch (err) {
      console.error('Error saving goal:', err);
      setMessage({ type: 'error', text: 'Failed to save goal. Please try again.' });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading your goals...</p>
      </div>
    );
  }

  return (
    <div className="goal-form">
      {message.text && (
        <div className={`message ${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="goal-selection">
          <h3>Select a Distance</h3>
        <div className="distance-buttons">
            {distances.map((distance) => (
                <button
              key={distance}
                  type="button"
                  onClick={() => handleDistanceSelect(distance)}
              className={`distance-button ${selectedDistance === distance ? 'selected' : ''}`}
                >
                  {distance}
                </button>
            ))}
        </div>
      </div>

      {selectedDistance && (
        <div className="time-input">
          <h3>Set Goal for {selectedDistance}</h3>
          <div className="input-group">
            <label htmlFor="targetTime">Target Time</label>
            <input
              id="targetTime"
              type="text"
              value={targetTime}
              onChange={(e) => setTargetTime(e.target.value)}
              placeholder="e.g., 00:26:00"
            />
            <small>Format: HH:MM:SS or MM:SS</small>
          </div>
          <div className="button-group">
            <button 
              type="button" 
              onClick={handleSaveGoal}
              className="save-button"
            >
              Save Goal
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedDistance('');
                setTargetTime('');
                setMessage({ type: '', text: '' });
              }}
              className="back-button"
            >
              Back
            </button>
          </div>
        </div>
      )}

      <div className="existing-goals">
        <h3>Your Current Goals</h3>
        <div className="goals-list">
        {distances.map((distance) => (
            <div key={distance} className="goal-item">
              <span className="distance">{distance}</span>
              <span className="time">{existingGoals[distance] || 'Not Set'}</span>
            </div>
        ))}
        </div>
      </div>
    </div>
  );
};

export default GoalSurveyForm;