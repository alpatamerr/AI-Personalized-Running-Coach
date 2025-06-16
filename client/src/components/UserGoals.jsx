import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/UserGoals.css';

const distances = ['5K', '10K', 'Half Marathon', 'Marathon', 'Ultramarathon'];

const UserGoals = ({ userId }) => {
  const [goals, setGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const [editingGoal, setEditingGoal] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [editDistance, setEditDistance] = useState('');
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);
  const [addDistance, setAddDistance] = useState('');
  const [addValue, setAddValue] = useState('');
  const [addSaving, setAddSaving] = useState(false);

  useEffect(() => {
    const fetchGoals = async () => {
      try {
        const response = await fetch(`/api/goals/${userId}`, {
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch goals');
        }

        const data = await response.json();
        if (data && data.success && Array.isArray(data.data)) {
          setGoals(data.data);
        } else if (Array.isArray(data)) {
          setGoals(data);
        } else {
          setGoals([]);
        }
      } catch (error) {
        console.error('Error fetching goals:', error);
        setError('Failed to load your goals');
      } finally {
        setIsLoading(false);
      }
    };

    if (userId) {
      fetchGoals();
    }
  }, [userId]);

  const handleDelete = async (distance) => {
    if (!window.confirm('Are you sure you want to delete this goal?')) return;
    setDeleting(distance);
    try {
      const response = await fetch(`/api/goals/${userId}/${distance}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to delete goal');
      setGoals(goals.filter(goal => goal.distance !== distance));
    } catch (err) {
      alert('Failed to delete goal.');
    } finally {
      setDeleting(null);
    }
  };

  const handleEdit = (goal) => {
    setEditingGoal(goal.distance);
    setEditDistance(goal.distance);
    setEditValue(goal.targetTime);
  };

  const handleEditSave = async (goal) => {
    setSaving(true);
    try {
      // If distance changed, delete old goal first
      if (editDistance !== goal.distance) {
        await fetch(`/api/goals/${userId}/${goal.distance}`, {
          method: 'DELETE',
          credentials: 'include',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      }
      // Save or update the new goal
      const response = await fetch(`/api/goals`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, distance: editDistance, targetTime: editValue })
      });
      if (!response.ok) throw new Error('Failed to update goal');
      // Update state
      let updatedGoals = goals.filter(g => g.distance !== goal.distance);
      // If the new distance already exists, update it, else add it
      const existing = updatedGoals.find(g => g.distance === editDistance);
      if (existing) {
        updatedGoals = updatedGoals.map(g => g.distance === editDistance ? { ...g, targetTime: editValue } : g);
      } else {
        updatedGoals.push({ ...goal, distance: editDistance, targetTime: editValue });
      }
      setGoals(updatedGoals);
      setEditingGoal(null);
    } catch (err) {
      alert('Failed to update goal.');
    } finally {
      setSaving(false);
    }
  };

  const handleAddGoal = () => {
    setAdding(true);
    setAddDistance('');
    setAddValue('');
  };

  const handleAddSave = async () => {
    if (!addDistance || !addValue) return;
    setAddSaving(true);
    try {
      const response = await fetch(`/api/goals`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, distance: addDistance, targetTime: addValue })
      });
      if (!response.ok) throw new Error('Failed to add goal');
      setGoals([...goals, { distance: addDistance, targetTime: addValue }]);
      setAdding(false);
    } catch (err) {
      alert('Failed to add goal.');
    } finally {
      setAddSaving(false);
    }
  };

  const handleAddCancel = () => {
    setAdding(false);
    setAddDistance('');
    setAddValue('');
  };

  // Compute available distances for adding
  const usedDistances = goals.map(g => g.distance);
  const availableDistances = distances.filter(d => !usedDistances.includes(d));

  if (isLoading) {
    return (
      <div className="goals-loading">
        <div className="loading-spinner"></div>
        <p>Loading your goals...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="goals-error">
        <p>{error}</p>
        <Link to="/goals" className="set-goals-button">Set Your Goals</Link>
      </div>
    );
  }

  if (!goals || goals.length === 0) {
    return (
      <div className="no-goals">
        <p>You haven't set any running goals yet.</p>
        <Link to="/goals" className="set-goals-button">Set Your Goals</Link>
      </div>
    );
  }

  return (
    <div className="user-goals">
      <div className="goals-grid">
        <div className="goal-card add-goal-card">
          {!adding ? (
            <button className="add-goal-btn" onClick={handleAddGoal} disabled={availableDistances.length === 0}>
              + Add Goal
            </button>
          ) : (
            <form onSubmit={e => { e.preventDefault(); handleAddSave(); }} className="edit-goal-form">
              <select
                value={addDistance}
                onChange={e => setAddDistance(e.target.value)}
                className="edit-goal-select"
                disabled={addSaving}
                required
              >
                <option value="" disabled>Select Distance</option>
                {availableDistances.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
              <input
                value={addValue}
                onChange={e => setAddValue(e.target.value)}
                required
                className="edit-goal-input"
                disabled={addSaving}
                placeholder="Target Time"
              />
              <button type="submit" className="save-goal-btn" disabled={addSaving || !addDistance || !addValue}>{addSaving ? 'Saving...' : 'Save'}</button>
              <button type="button" className="cancel-goal-btn" onClick={handleAddCancel} disabled={addSaving}>Cancel</button>
            </form>
          )}
        </div>
        {goals.map((goal) => (
          <div key={goal.distance} className="goal-card">
            <h3>{editingGoal === goal.distance ? (
              <select
                value={editDistance}
                onChange={e => setEditDistance(e.target.value)}
                className="edit-goal-select"
                disabled={saving}
              >
                {distances.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            ) : goal.distance}</h3>
            {editingGoal === goal.distance ? (
              <form onSubmit={e => { e.preventDefault(); handleEditSave(goal); }} className="edit-goal-form">
                <input
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  required
                  className="edit-goal-input"
                  disabled={saving}
                />
                <button type="submit" className="save-goal-btn" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
                <button type="button" className="cancel-goal-btn" onClick={() => setEditingGoal(null)} disabled={saving}>Cancel</button>
              </form>
            ) : (
              <>
                <p className="target-time">{goal.targetTime}</p>
                {goal.currentBest && (
                  <p className="current-best">
                    Current Best: {goal.currentBest}
                  </p>
                )}
                <div className="goal-progress">
                  {goal.progress && (
                    <div 
                      className="progress-bar" 
                      style={{ width: `${Math.min(goal.progress, 100)}%` }}
                    >
                      {goal.progress}%
                    </div>
                  )}
                </div>
                <div className="goal-actions">
                  <button className="edit-goal-btn" onClick={() => handleEdit(goal)} disabled={deleting === goal.distance}>Edit</button>
                  <button className="delete-goal-btn" onClick={() => handleDelete(goal.distance)} disabled={deleting === goal.distance}>
                    {deleting === goal.distance ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserGoals; 