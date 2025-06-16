import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SelectTimePage = ({ setHasSetGoals }) => {
  const [time, setTime] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic validation: require non-empty and match HH:MM:SS or MM:SS
    const timeRegex = /^(\d{2}:)?\d{2}:\d{2}$/;
    if (!time || !timeRegex.test(time)) {
      setError('Please enter a valid time (MM:SS or HH:MM:SS)');
      return;
    }
    setLoading(true);
    setError('');
    try {
      // Save to backend
      const userId = localStorage.getItem('userId');
      const selectedGoal = localStorage.getItem('selectedGoal');
      const selectedDistance = localStorage.getItem('selectedDistance');
      // Adjust API as needed for your backend
      const res = await fetch('/api/goals', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          userId,
          goalType: selectedGoal,
          distance: selectedDistance,
          targetTime: time
        })
      });
      if (!res.ok) throw new Error('Failed to save goal');
      if (typeof setHasSetGoals === 'function') setHasSetGoals(true);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to save goal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="goal-setting-container">
      <h1>Do you have a target time?</h1>
      <form onSubmit={handleSubmit} className="goal-form">
        <input
          type="text"
          placeholder="e.g. 25:00 for 5k"
          value={time}
          onChange={e => setTime(e.target.value)}
        />
        {error && <div className="error-message">{error}</div>}
        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? 'Saving...' : 'Continue'}
        </button>
      </form>
    </div>
  );
};

export default SelectTimePage; 